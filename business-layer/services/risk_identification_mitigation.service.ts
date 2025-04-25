// business-layer\services\risk_identification_mitigation.service.ts:

import { Request } from 'express';
import { InventoryService } from './erp_inventory.service';
import { ManufacturingService } from './erp_manufacturing.service';
import { SRMProcurementService } from './srm_procurement.service';
import { SRMContractService } from './srm_contract.service';
import { CRMRequisitionService } from './crm_requisition.service';
import { CRMContractService } from './crm_contract.service';
import { RiskBaseService } from './risk_base.service';
import { RiskRateTrendData } from './risk_monitoring.service';
import * as forecastIntegration from '../../data-access/integrations/forecast.integration';
import { ForecastData } from '../../helpers/dtos/risk_identification.dto';

// Interface untuk hasil gabungan identifikasi dan mitigasi risiko
export interface RiskIdentificationMitigationResult {
  pkid?: string | number;
  risk_name: string;
  risk_desc: string;
  risk_user: string;
  risk_group: string;
  risk_mitigation: string;
  tenant_id?: string;
  priority: string;
  forecast_prediction: string;
  mitigation_effectivity: number | string;
}

export class RiskIdentificationMitigationService {
  private inventoryService: InventoryService;
  private manufacturingService: ManufacturingService;
  private srmProcurementService: SRMProcurementService;
  private srmContractService: SRMContractService;
  private crmRequisitionService: CRMRequisitionService;
  private crmContractService: CRMContractService;
  private riskBaseService: RiskBaseService;

  constructor() {
    this.inventoryService = new InventoryService();
    this.manufacturingService = new ManufacturingService();
    this.srmProcurementService = new SRMProcurementService();
    this.srmContractService = new SRMContractService();
    this.crmRequisitionService = new CRMRequisitionService();
    this.crmContractService = new CRMContractService();
    this.riskBaseService = new RiskBaseService();
  }

  /**
   * Fungsi untuk mendapatkan kode berdasarkan tenant_id dari database
   * @param req Request object
   * @param tenantId ID tenant
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @returns Kode yang sesuai dengan tenant_id dan tipe user
   */

  private async getCodeFromTenantId(
    req: Request,
    tenantId: string,
    riskUser: string,
  ): Promise<string | undefined> {
    try {
      // Dapatkan satu risk base saja berdasarkan tenant_id untuk mencari kode
      const searchCriteria: Record<string, string | number | undefined> = {
        risk_user: riskUser,
        tenant_id: !isNaN(Number(tenantId)) ? Number(tenantId) : undefined,
      };

      console.log(`Searching for code mapping with criteria:`, searchCriteria);

      // Cari semua risk base dengan tenant_id tersebut
      const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        searchCriteria,
      );

      if (!riskBaseList || riskBaseList.length === 0) {
        console.log(
          `No risk base found for tenant_id ${tenantId} and user ${riskUser}`,
        );
        return undefined;
      }

      // Langsung buat kode generik berdasarkan tenant_id
      const code = this.generateCodeFromTenantId(tenantId, riskUser);

      console.log(
        `Generated code ${code} for tenant_id ${tenantId} and user ${riskUser}`,
      );
      return code;
    } catch (error) {
      console.error(`Error getting code for tenant_id ${tenantId}:`, error);
      return this.generateCodeFromTenantId(tenantId, riskUser);
    }
  }

  /**
   * Menghasilkan kode berdasarkan tenant_id dan jenis pengguna
   * @param tenantId ID tenant
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @returns Kode yang dihasilkan
   */
  private generateCodeFromTenantId(tenantId: string, riskUser: string): string {
    // Pastikan tenantId adalah string
    const id = String(tenantId);
    // Pad dengan 0 di depan hingga minimal 3 digit
    const paddedId = id.padStart(3, '0');

    if (riskUser === 'Industry') {
      return `IND-${paddedId}`;
    } else if (riskUser === 'Supplier') {
      return `SUP-${paddedId}`;
    } else if (riskUser === 'Retail') {
      return `RTL-${paddedId}`;
    }

    // Default jika user tidak dikenal
    return `CODE-${paddedId}`;
  }

  /**
   * Mendapatkan data gabungan identifikasi dan mitigasi risiko berdasarkan user
   * @param req Request object
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @param tenantId ID tenant (opsional)
   * @param industryCode Kode industri (opsional)
   * @param supplierCode Kode supplier (opsional)
   * @param retailCode Kode retail (opsional)
   * @returns Data gabungan identifikasi dan mitigasi risiko
   */
  async getRiskIdentificationAndMitigation(
    req: Request,
    riskUser: string,
    tenantId?: string,
    industryCode?: string,
    supplierCode?: string,
    retailCode?: string,
  ): Promise<RiskIdentificationMitigationResult[]> {
    try {
      // Dapatkan daftar risk base berdasarkan risk_user
      const searchCriteria: Record<string, string | number | undefined> = {
        risk_user: riskUser,
      };

      // Jika tenant_id tersedia, gunakan untuk pencarian dan dapatkan kode yang sesuai
      if (tenantId) {
        const numericTenantId = !isNaN(Number(tenantId))
          ? Number(tenantId)
          : undefined;

        console.log(
          `Converting tenant_id: ${tenantId} to numeric: ${numericTenantId}`,
        );

        if (numericTenantId !== undefined) {
          searchCriteria.tenant_id = numericTenantId;

          // Log untuk debugging
          console.log(`Using tenant_id: ${numericTenantId} for risk search`);

          // Jika kode spesifik belum ada, coba dapatkan dari database berdasarkan tenant_id
          if (riskUser.toLowerCase() === 'industry' && !industryCode) {
            industryCode = await this.getCodeFromTenantId(
              req,
              tenantId,
              riskUser,
            );
            console.log(
              `Using industry_code: ${industryCode} from tenant_id: ${tenantId}`,
            );
          } else if (riskUser.toLowerCase() === 'supplier' && !supplierCode) {
            supplierCode = await this.getCodeFromTenantId(
              req,
              tenantId,
              riskUser,
            );
            console.log(
              `Using supplier_code: ${supplierCode} from tenant_id: ${tenantId}`,
            );
          } else if (riskUser.toLowerCase() === 'retail' && !retailCode) {
            retailCode = await this.getCodeFromTenantId(
              req,
              tenantId,
              riskUser,
            );
            console.log(
              `Using retail_code: ${retailCode} from tenant_id: ${tenantId}`,
            );
          }
        }
      }

      console.log('Search criteria:', searchCriteria);
      console.log('Codes to use for service calls:', {
        industryCode,
        supplierCode,
        retailCode,
      });

      const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        searchCriteria,
      );

      console.log(`Found ${riskBaseList.length} risk bases for criteria`);

      const combinedResultList: RiskIdentificationMitigationResult[] = [];

      // Loop untuk setiap risiko dan gabungkan hasil identifikasi dan mitigasi
      for (const riskBase of riskBaseList) {
        try {
          const { pkid, risk_name, risk_desc, risk_group, risk_mitigation } =
            riskBase;

          // Inisialisasi dengan nilai default
          let riskRate: number | null = null;
          let forecastPrediction = 'Data Prediksi Forecast Tidak Tersedia';
          let mitigationEffectivity: number | string =
            'Gagal mendapatkan data risiko';
          let riskRateTrend: RiskRateTrendData[] = [];
          let riskRateTrendSuccess = false;

          // Normalisasi riskUser untuk pencocokan yang tidak case-sensitive
          const normalizedRiskUser = riskUser.toLowerCase();

          try {
            // Proses pengambilan data risiko dan forecast
            if (normalizedRiskUser === 'industry') {
              // Proses berdasarkan risk_group Industry
              if (risk_group === 'Inventory') {
                if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
                  const inventoryReceiveSummary =
                    await this.inventoryService.getReceiveSummary();
                  riskRate = inventoryReceiveSummary.reject_rate;

                  const forecastData =
                    await forecastIntegration.getRejectReceiveByYearIndustry();
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.inventoryService.getReceiveRiskRateTrend();
                  riskRateTrendSuccess = true;
                } else if (
                  risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)'
                ) {
                  const inventoryTransferSummary =
                    await this.inventoryService.getTransferSummary();
                  riskRate = inventoryTransferSummary.reject_rate;

                  const forecastData =
                    await forecastIntegration.getRejectTransferByYearIndustry();
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.inventoryService.getTransferRiskRateTrend();
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'Manufacturing') {
                if (risk_name === 'Produk Cacat') {
                  const manufacturingSummary =
                    await this.manufacturingService.getInspectionProductSummary();
                  riskRate = manufacturingSummary.defect_rate;

                  const forecastData =
                    await forecastIntegration.getDefectInspectionProductByYearIndustry();
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.manufacturingService.getDefectRiskRateTrend();
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'SRM Procurement') {
                if (risk_name === 'Keterlambatan RFQ') {
                  const procurementSummary =
                    await this.srmProcurementService.getRFQDelaySummary(
                      industryCode,
                    );
                  riskRate = procurementSummary.delay_rate;

                  const forecastData =
                    await forecastIntegration.getDelayedSRMIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmProcurementService.getRFQDelayRiskRateTrend(
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'SRM Contract') {
                if (risk_name === 'Penerimaan terlambat') {
                  const contractSummary =
                    await this.srmContractService.getLateReceiptSummary(
                      undefined,
                      industryCode,
                    );
                  riskRate = contractSummary.late_receipt_rate;

                  const forecastData =
                    await forecastIntegration.getLateSRMIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getLateReceiptRiskRateTrend(
                      undefined,
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Jumlah diterima tidak sesuai') {
                  const contractSummary =
                    await this.srmContractService.getQuantityMismatchSummary(
                      undefined,
                      industryCode,
                    );
                  riskRate = contractSummary.mismatch_rate;

                  const forecastData =
                    await forecastIntegration.getNoncompliantQuantitySRMIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getQuantityMismatchRiskRateTrend(
                      undefined,
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'SRM Inspection') {
                if (risk_name === 'Tidak lolos cek kebersihan') {
                  const inspectionSummary =
                    await this.srmContractService.getCleanlinessCheckSummary(
                      undefined,
                      industryCode,
                    );
                  riskRate = inspectionSummary.fail_rate;

                  const forecastData =
                    await forecastIntegration.getUncleanCheckIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getCleanlinessCheckRiskRateTrend(
                      undefined,
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Tidak lolos cek brix') {
                  const inspectionSummary =
                    await this.srmContractService.getBrixCheckSummary(
                      undefined,
                      industryCode,
                    );
                  riskRate = inspectionSummary.fail_rate;

                  const forecastData =
                    await forecastIntegration.getUnderBrixCheckIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getBrixCheckRiskRateTrend(
                      undefined,
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'CRM Requisition') {
                if (risk_name === 'Penolakan LoR') {
                  const requisitionSummary =
                    await this.crmRequisitionService.getLoRRejectionSummary(
                      undefined,
                      industryCode,
                    );
                  riskRate = requisitionSummary.rejection_rate;

                  const forecastData =
                    await forecastIntegration.getLORRejectIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
                      undefined,
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Penolakan LoA') {
                  const requisitionSummary =
                    await this.crmRequisitionService.getLoARejectionSummary(
                      undefined,
                      industryCode,
                    );
                  riskRate = requisitionSummary.rejection_rate;

                  const forecastData =
                    await forecastIntegration.getLOARejectIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmRequisitionService.getLoARejectionRiskRateTrend(
                      undefined,
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'CRM Contract') {
                if (risk_name === 'Penurunan jumlah kontrak') {
                  const contractSummary =
                    await this.crmContractService.getContractDeclineSummary(
                      industryCode,
                    );
                  riskRate = contractSummary.decline_rate;

                  const forecastData =
                    await forecastIntegration.getTotalContractCRMIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmContractService.getContractDeclineRiskRateTrend(
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Pengiriman terlambat') {
                  const contractSummary =
                    await this.crmContractService.getLateDeliverySummary(
                      industryCode,
                    );
                  riskRate = contractSummary.late_delivery_rate;

                  const forecastData =
                    await forecastIntegration.getLateCRMIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmContractService.getLateDeliveryRiskRateTrend(
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
                  const contractSummary =
                    await this.crmContractService.getQuantityMismatchSummary(
                      industryCode,
                    );
                  riskRate = contractSummary.mismatch_rate;

                  const forecastData =
                    await forecastIntegration.getNoncompliantQuantityCRMIndustry(
                      industryCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmContractService.getQuantityMismatchRiskRateTrend(
                      industryCode,
                    );
                  riskRateTrendSuccess = true;
                }
              }
            } else if (normalizedRiskUser === 'supplier') {
              // Logika untuk SUPPLIER
              if (risk_group === 'Procurement') {
                if (risk_name === 'Kekalahan pada proses RFQ') {
                  const procurementSummary =
                    await this.srmProcurementService.getRFQLossSummary(
                      supplierCode || '',
                    );
                  riskRate = procurementSummary.loss_rate;

                  const forecastData =
                    await forecastIntegration.getLoseCountSupplier(
                      supplierCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmProcurementService.getRFQLossRiskRateTrend(
                      supplierCode || '',
                    );
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'Contract') {
                if (risk_name === 'Penurunan jumlah kontrak') {
                  const contractSummary =
                    await this.srmContractService.getContractDeclineSummary(
                      supplierCode,
                    );
                  riskRate = contractSummary.decline_rate;

                  const forecastData =
                    await forecastIntegration.getTotalContractSRMSupplier(
                      supplierCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getContractDeclineRiskRateTrend(
                      supplierCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Pengiriman terlambat') {
                  const contractSummary =
                    await this.srmContractService.getLateReceiptSummary(
                      supplierCode,
                    );
                  riskRate = contractSummary.late_receipt_rate;

                  const forecastData =
                    await forecastIntegration.getLateSRMSupplier(
                      supplierCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getLateReceiptRiskRateTrend(
                      supplierCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
                  const contractSummary =
                    await this.srmContractService.getQuantityMismatchSummary(
                      supplierCode,
                    );
                  riskRate = contractSummary.mismatch_rate;

                  const forecastData =
                    await forecastIntegration.getNoncompliantQuantitySRMSupplier(
                      supplierCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getQuantityMismatchRiskRateTrend(
                      supplierCode,
                    );
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'Inspection') {
                if (risk_name === 'Tidak lolos cek kebersihan') {
                  const inspectionSummary =
                    await this.srmContractService.getCleanlinessCheckSummary(
                      supplierCode,
                    );
                  riskRate = inspectionSummary.fail_rate;

                  const forecastData =
                    await forecastIntegration.getUncleanCheckSupplier(
                      supplierCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getCleanlinessCheckRiskRateTrend(
                      supplierCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Tidak lolos cek brix') {
                  const inspectionSummary =
                    await this.srmContractService.getBrixCheckSummary(
                      supplierCode,
                    );
                  riskRate = inspectionSummary.fail_rate;

                  const forecastData =
                    await forecastIntegration.getUnderBrixCheckSupplier(
                      supplierCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.srmContractService.getBrixCheckRiskRateTrend(
                      supplierCode,
                    );
                  riskRateTrendSuccess = true;
                }
              }
            } else if (normalizedRiskUser === 'retail') {
              // Logika untuk RETAIL
              if (risk_group === 'Requisition') {
                if (risk_name === 'Penolakan LoR') {
                  const requisitionSummary =
                    await this.crmRequisitionService.getLoRRejectionSummary(
                      retailCode,
                    );
                  riskRate = requisitionSummary.rejection_rate;

                  const forecastData =
                    await forecastIntegration.getLORRejectRetail(
                      retailCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
                      retailCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Penolakan LoA') {
                  const requisitionSummary =
                    await this.crmRequisitionService.getLoARejectionSummary(
                      retailCode,
                    );
                  riskRate = requisitionSummary.rejection_rate;

                  const forecastData =
                    await forecastIntegration.getLOARejectRetail(
                      retailCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmRequisitionService.getLoARejectionRiskRateTrend(
                      retailCode,
                    );
                  riskRateTrendSuccess = true;
                }
              } else if (risk_group === 'Contract') {
                if (risk_name === 'Penerimaan terlambat') {
                  const contractSummary =
                    await this.crmContractService.getLateDeliverySummary(
                      undefined,
                      retailCode,
                    );
                  riskRate = contractSummary.late_delivery_rate;

                  const forecastData =
                    await forecastIntegration.getLateCRMRetail(
                      retailCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmContractService.getLateDeliveryRiskRateTrend(
                      undefined,
                      retailCode,
                    );
                  riskRateTrendSuccess = true;
                } else if (risk_name === 'Jumlah diterima tidak sesuai') {
                  const contractSummary =
                    await this.crmContractService.getQuantityMismatchSummary(
                      undefined,
                      retailCode,
                    );
                  riskRate = contractSummary.mismatch_rate;

                  const forecastData =
                    await forecastIntegration.getNoncompliantQuantityCRMRetail(
                      retailCode || '',
                    );
                  forecastPrediction = this.calculateForecastPrediction(
                    forecastData.data,
                  );

                  riskRateTrend =
                    await this.crmContractService.getQuantityMismatchRiskRateTrend(
                      undefined,
                      retailCode,
                    );
                  riskRateTrendSuccess = true;
                }
              }
            }
          } catch (dataError) {
            console.error(
              `Error fetching data for risk ${risk_name}:`,
              dataError,
            );
            riskRate = null;
            forecastPrediction = 'Gagal mengambil data prediksi forecast';
            // Jadikan false karena gagal mengambil data
            riskRateTrendSuccess = false;
          }

          // Hitung prioritas risiko berdasarkan risk rate
          const priority = this.calculateRiskPriority(riskRate);

          // Pastikan bahwa riskRateTrend berhasil didapatkan (flag riskRateTrendSuccess = true)
          if (riskRateTrendSuccess) {
            try {
              // Hitung efektivitas mitigasi jika ada data trend lebih dari 1 tahun
              if (riskRateTrend && riskRateTrend.length >= 2) {
                // Mendapatkan 2 tahun terakhir, diurutkan dari yang terbaru (tahun terakhir)
                const sortedTrend = [...riskRateTrend].sort(
                  (a, b) => parseInt(b.year) - parseInt(a.year),
                );

                const currentYearRate = sortedTrend[0].value;
                const previousYearRate = sortedTrend[1].value;

                // Hanya hitung efektivitas jika ada penurunan rate
                if (
                  previousYearRate > 0 &&
                  currentYearRate < previousYearRate
                ) {
                  const rateDecrease = previousYearRate - currentYearRate;
                  mitigationEffectivity = parseFloat(
                    ((rateDecrease / previousYearRate) * 100).toFixed(2),
                  );
                } else if (currentYearRate >= previousYearRate) {
                  mitigationEffectivity = 0; // Tidak ada efektivitas jika rate tidak menurun
                }
              } else {
                // Data berhasil didapatkan tapi tidak cukup untuk dihitung
                mitigationEffectivity =
                  'Data tidak cukup untuk menghitung efektivitas';
              }
            } catch (error) {
              // Error saat menghitung mitigation_effectivity
              console.error(
                `Error calculating mitigation effectivity for risk ${risk_name}:`,
                error,
              );
              mitigationEffectivity = 'Gagal mendapatkan data risiko';
            }
          } else {
            // Data tidak berhasil didapatkan, gunakan pesan error
            mitigationEffectivity = 'Gagal mendapatkan data risiko';
          }

          // Ambil tenant_id dari riskBase jika ada
          // Mengambil tenant_id dari hasil database dan pastikan diubah ke string
          const risk_tenant_id =
            riskBase.tenant_id !== undefined && riskBase.tenant_id !== null
              ? String(riskBase.tenant_id)
              : tenantId;

          // Tambahkan ke hasil gabungan
          combinedResultList.push({
            pkid,
            risk_name,
            risk_desc,
            risk_user: riskUser,
            risk_group,
            risk_mitigation,
            tenant_id: risk_tenant_id,
            priority,
            forecast_prediction: forecastPrediction,
            mitigation_effectivity: mitigationEffectivity,
          });
        } catch (riskError) {
          console.error(`Error processing risk:`, riskError);
          // Tambahkan data minimal untuk risiko yang gagal diproses
          if (riskBase) {
            combinedResultList.push({
              pkid: riskBase.pkid,
              risk_name: riskBase.risk_name || 'Error retrieving risk data',
              risk_desc: riskBase.risk_desc || '',
              risk_user: riskUser,
              risk_group: riskBase.risk_group || '',
              risk_mitigation: riskBase.risk_mitigation || '',
              tenant_id:
                riskBase.tenant_id !== undefined
                  ? String(riskBase.tenant_id)
                  : tenantId,
              priority: 'Gagal menghitung prioritas',
              forecast_prediction: 'Data Prediksi Forecast Tidak Tersedia',
              mitigation_effectivity: 'Gagal mendapatkan data risiko',
            });
          }
        }
      }

      return combinedResultList;
    } catch (error) {
      console.error('Error in getRiskIdentificationAndMitigation:', error);
      // Kembalikan array kosong jika terjadi error pada level tinggi
      return [];
    }
  }

  /**
   * Mendapatkan data spesifik gabungan identifikasi dan mitigasi risiko
   * @param req Request object
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @param riskName Nama risiko
   * @param tenantId ID tenant (opsional)
   * @param industryCode Kode industri (opsional)
   * @param supplierCode Kode supplier (opsional)
   * @param retailCode Kode retail (opsional)
   * @returns Data spesifik gabungan identifikasi dan mitigasi risiko
   */
  async getSpecificRiskIdentificationAndMitigation(
    req: Request,
    riskUser: string,
    riskName: string,
    tenantId?: string,
    industryCode?: string,
    supplierCode?: string,
    retailCode?: string,
  ): Promise<RiskIdentificationMitigationResult | null> {
    try {
      const results = await this.getRiskIdentificationAndMitigation(
        req,
        riskUser,
        tenantId,
        industryCode,
        supplierCode,
        retailCode,
      );

      // Filter hasil berdasarkan nama risiko
      const specificResult = results.find(
        (result) => result.risk_name === riskName,
      );

      return specificResult || null;
    } catch (error) {
      console.error(
        'Error in getSpecificRiskIdentificationAndMitigation:',
        error,
      );
      // Return null jika terjadi error
      return null;
    }
  }

  /**
   * Fungsi untuk menghitung prioritas risiko berdasarkan risk rate
   * @param riskRate Tingkat risiko
   * @returns Prioritas risiko (Tinggi, Sedang, Rendah, atau pesan error)
   */
  private calculateRiskPriority(riskRate: number | null): string {
    if (riskRate === null) {
      return 'Data Risk Rate tidak tersedia';
    } else if (riskRate >= 71) {
      return 'Tinggi';
    } else if (riskRate >= 36) {
      return 'Sedang';
    } else {
      return 'Rendah';
    }
  }

  /**
   * Fungsi untuk menentukan prediksi tahun depan berdasarkan forecast data
   * @param forecastData Data forecast
   * @returns Prediksi forecast (Akan Meningkat atau Akan Menurun)
   */
  private calculateForecastPrediction(forecastData: ForecastData): string {
    try {
      const actualData = forecastData.actual_data;
      const forecastDataYear = forecastData.forecast_data[0].value;

      const lastActualValue = actualData[actualData.length - 1].value;

      if (lastActualValue < forecastDataYear) {
        return 'Akan Meningkat';
      } else {
        return 'Akan Menurun';
      }
    } catch (error) {
      console.error('Error calculating forecast prediction:', error);
      return 'Data Prediksi Forecast Tidak Tersedia';
    }
  }
}
