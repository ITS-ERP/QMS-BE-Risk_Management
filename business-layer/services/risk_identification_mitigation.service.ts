import { Request } from 'express';
import { InventoryService } from './erp_inventory.service';
import { ManufacturingService } from './erp_manufacturing.service';
import { SRMProcurementService } from './srm_procurement.service';
import { SRMContractService } from './srm_contract.service';
import { CRMRequisitionService } from './crm_requisition.service';
import { CRMContractService } from './crm_contract.service';
import { RiskBaseService } from './risk_base.service';
import { RiskRateTrendData } from './risk_monitoring.service';
// DIHAPUS: import * as forecastIntegration from '../../data-access/integrations/forecast.integration';
// DIHAPUS: import { ForecastData } from '../../helpers/dtos/risk_identification.dto';

export interface RiskIdentificationMitigationResult {
  pkid?: string | number;
  risk_name: string;
  risk_desc: string;
  risk_user: string;
  risk_group: string;
  risk_mitigation: string;
  tenant_id?: string;
  priority: string;
  // DIHAPUS: forecast_prediction: string;
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
   * Mendapatkan data gabungan identifikasi dan mitigasi risiko berdasarkan user
   */
  async getRiskIdentificationAndMitigation(
    req: Request,
    riskUser: string,
    tenantId?: number,
  ): Promise<RiskIdentificationMitigationResult[]> {
    try {
      const searchCriteria: Record<string, string | number | undefined> = {
        risk_user: riskUser,
      };

      if (tenantId !== undefined) {
        searchCriteria.tenant_id = tenantId;
      }

      console.log('Search criteria:', searchCriteria);

      const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        searchCriteria,
      );

      console.log(`Found ${riskBaseList.length} risk bases for criteria`);

      const combinedResultList: RiskIdentificationMitigationResult[] = [];

      for (const riskBase of riskBaseList) {
        try {
          const { pkid, risk_name, risk_desc, risk_group, risk_mitigation } =
            riskBase;

          let riskRate: number | null = null;
          // DIHAPUS: let forecastPrediction = 'Data Prediksi Forecast Tidak Tersedia';
          let mitigationEffectivity: number | string =
            'Gagal mendapatkan data risiko';
          let riskRateTrend: RiskRateTrendData[] = [];
          let riskRateTrendSuccess = false;

          const normalizedRiskUser = riskUser.toLowerCase();

          try {
            if (normalizedRiskUser === 'industry') {
              const result = await this.processIndustryRisk(
                req,
                risk_group,
                risk_name,
                tenantId,
              );
              riskRate = result.riskRate;
              // DIHAPUS: forecastPrediction = result.forecastPrediction;
              riskRateTrend = result.riskRateTrend;
              riskRateTrendSuccess = result.success;
            } else if (normalizedRiskUser === 'supplier') {
              const result = await this.processSupplierRisk(
                req,
                risk_group,
                risk_name,
                tenantId,
              );
              riskRate = result.riskRate;
              // DIHAPUS: forecastPrediction = result.forecastPrediction;
              riskRateTrend = result.riskRateTrend;
              riskRateTrendSuccess = result.success;
            } else if (normalizedRiskUser === 'retail') {
              const result = await this.processRetailRisk(
                req,
                risk_group,
                risk_name,
                tenantId,
              );
              riskRate = result.riskRate;
              // DIHAPUS: forecastPrediction = result.forecastPrediction;
              riskRateTrend = result.riskRateTrend;
              riskRateTrendSuccess = result.success;
            }
          } catch (dataError) {
            console.error(
              `Error fetching data for risk ${risk_name}:`,
              dataError,
            );
            riskRate = null;
            // DIHAPUS: forecastPrediction = 'Gagal mengambil data prediksi forecast';
            riskRateTrendSuccess = false;
          }

          const priority = this.calculateRiskPriority(riskRate);

          if (
            riskRateTrendSuccess &&
            riskRateTrend &&
            riskRateTrend.length >= 2
          ) {
            mitigationEffectivity =
              this.calculateMitigationEffectivity(riskRateTrend);
          } else {
            mitigationEffectivity = riskRateTrendSuccess
              ? 'Data tidak cukup untuk menghitung efektivitas'
              : 'Gagal mendapatkan data risiko';
          }

          const risk_tenant_id =
            riskBase.tenant_id !== undefined && riskBase.tenant_id !== null
              ? String(riskBase.tenant_id)
              : tenantId
                ? String(tenantId)
                : undefined;

          combinedResultList.push({
            pkid,
            risk_name,
            risk_desc,
            risk_user: riskUser,
            risk_group,
            risk_mitigation,
            tenant_id: risk_tenant_id,
            priority,
            // DIHAPUS: forecast_prediction: forecastPrediction,
            mitigation_effectivity: mitigationEffectivity,
          });
        } catch (riskError) {
          console.error(`Error processing risk:`, riskError);
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
                  : tenantId
                    ? String(tenantId)
                    : undefined,
              priority: 'Gagal menghitung prioritas',
              // DIHAPUS: forecast_prediction: 'Data Prediksi Forecast Tidak Tersedia',
              mitigation_effectivity: 'Gagal mendapatkan data risiko',
            });
          }
        }
      }

      return combinedResultList;
    } catch (error) {
      console.error('Error in getRiskIdentificationAndMitigation:', error);
      return [];
    }
  }

  /**
   * Memproses risiko untuk Industry - SIMPLIFIED VERSION
   */
  private async processIndustryRisk(
    req: Request,
    risk_group: string,
    risk_name: string,
    tenantId?: number,
  ) {
    let riskRate: number | null = null;
    // DIHAPUS: let forecastPrediction = 'Data Prediksi Forecast Tidak Tersedia';
    let riskRateTrend: RiskRateTrendData[] = [];

    if (risk_group === 'Inventory') {
      if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
        const summary = await this.inventoryService.getReceiveSummary(
          req,
          tenantId,
        );
        riskRate = summary.reject_rate;
        // DIHAPUS: forecast integration
        riskRateTrend = await this.inventoryService.getReceiveRiskRateTrend(
          req,
          tenantId,
        );
      } else if (risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)') {
        const summary = await this.inventoryService.getTransferSummary(
          req,
          tenantId,
        );
        riskRate = summary.reject_rate;
        // DIHAPUS: forecast integration
        riskRateTrend = await this.inventoryService.getTransferRiskRateTrend(
          req,
          tenantId,
        );
      }
    } else if (risk_group === 'Manufacturing') {
      if (risk_name === 'Produk Cacat') {
        const summary =
          await this.manufacturingService.getInspectionProductSummary(
            req,
            tenantId,
          );
        riskRate = summary.defect_rate;
        // DIHAPUS: forecast integration
        riskRateTrend = await this.manufacturingService.getDefectRiskRateTrend(
          req,
          tenantId,
        );
      }
    } else if (risk_group === 'SRM Procurement') {
      if (risk_name === 'Penolakan Direct RFQ') {
        const summary = await this.srmProcurementService.getRFQLossSummary(
          req,
          tenantId,
          undefined,
        );
        riskRate = summary.loss_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.srmProcurementService.getRFQLossRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      }
    } else if (risk_group === 'SRM Contract') {
      if (risk_name === 'Penerimaan terlambat') {
        const summary = await this.srmContractService.getLateReceiptSummary(
          req,
          undefined,
          tenantId,
        );
        riskRate = summary.late_receipt_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.srmContractService.getLateReceiptRiskRateTrend(
            req,
            undefined,
            tenantId,
          );
      } else if (risk_name === 'Jumlah diterima tidak sesuai') {
        const summary =
          await this.srmContractService.getQuantityMismatchSummary(
            req,
            undefined,
            tenantId,
          );
        riskRate = summary.mismatch_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.srmContractService.getQuantityMismatchRiskRateTrend(
            req,
            undefined,
            tenantId,
          );
      }
    } else if (risk_group === 'CRM Requisition') {
      if (risk_name === 'Penolakan LoR') {
        const summary = await this.crmRequisitionService.getLoRRejectionSummary(
          tenantId,
          undefined,
        );
        riskRate = summary.rejection_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Penolakan LoA') {
        const summary = await this.crmRequisitionService.getLoARejectionSummary(
          tenantId,
          undefined,
        );
        riskRate = summary.rejection_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmRequisitionService.getLoARejectionRiskRateTrend(
            tenantId,
            undefined,
          );
      }
    } else if (risk_group === 'CRM Contract') {
      if (risk_name === 'Penurunan jumlah kontrak') {
        const summary = await this.crmContractService.getContractDeclineSummary(
          tenantId,
          undefined,
        );
        riskRate = summary.decline_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmContractService.getContractDeclineRiskRateTrend(
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Pengiriman terlambat') {
        const summary = await this.crmContractService.getLateDeliverySummary(
          tenantId,
          undefined,
        );
        riskRate = summary.late_delivery_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmContractService.getLateDeliveryRiskRateTrend(
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
        const summary =
          await this.crmContractService.getQuantityMismatchSummary(
            tenantId,
            undefined,
          );
        riskRate = summary.mismatch_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmContractService.getQuantityMismatchRiskRateTrend(
            tenantId,
            undefined,
          );
      }
    }

    // DIHAPUS: return forecastPrediction
    return { riskRate, riskRateTrend, success: true };
  }

  /**
   * Memproses risiko untuk Supplier - SIMPLIFIED VERSION
   */
  private async processSupplierRisk(
    req: Request,
    risk_group: string,
    risk_name: string,
    tenantId?: number,
  ) {
    let riskRate: number | null = null;
    // DIHAPUS: let forecastPrediction = 'Data Prediksi Forecast Tidak Tersedia';
    let riskRateTrend: RiskRateTrendData[] = [];

    if (risk_group === 'Procurement') {
      if (risk_name === 'Kekalahan pada proses RFQ') {
        const summary = await this.srmProcurementService.getRFQLossSummary(
          req,
          undefined,
          tenantId,
        );
        riskRate = summary.loss_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.srmProcurementService.getRFQLossRiskRateTrend(
            req,
            undefined,
            tenantId,
          );
      }
    } else if (risk_group === 'Contract') {
      if (risk_name === 'Penurunan jumlah kontrak') {
        const summary = await this.srmContractService.getContractDeclineSummary(
          req,
          tenantId,
          undefined,
        );
        riskRate = summary.decline_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.srmContractService.getContractDeclineRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Pengiriman terlambat') {
        const summary = await this.srmContractService.getLateReceiptSummary(
          req,
          tenantId,
          undefined,
        );
        riskRate = summary.late_receipt_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.srmContractService.getLateReceiptRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
        const summary =
          await this.srmContractService.getQuantityMismatchSummary(
            req,
            tenantId,
            undefined,
          );
        riskRate = summary.mismatch_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.srmContractService.getQuantityMismatchRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      }
    }

    // DIHAPUS: return forecastPrediction
    return { riskRate, riskRateTrend, success: true };
  }

  /**
   * Memproses risiko untuk Retail - SIMPLIFIED VERSION
   */
  private async processRetailRisk(
    req: Request,
    risk_group: string,
    risk_name: string,
    tenantId?: number,
  ) {
    let riskRate: number | null = null;
    // DIHAPUS: let forecastPrediction = 'Data Prediksi Forecast Tidak Tersedia';
    let riskRateTrend: RiskRateTrendData[] = [];

    if (risk_group === 'Requisition') {
      if (risk_name === 'Penolakan LoR') {
        const summary = await this.crmRequisitionService.getLoRRejectionSummary(
          undefined,
          tenantId,
        );
        riskRate = summary.rejection_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
            undefined,
            tenantId,
          );
      } else if (risk_name === 'Penolakan LoA') {
        const summary = await this.crmRequisitionService.getLoARejectionSummary(
          undefined,
          tenantId,
        );
        riskRate = summary.rejection_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmRequisitionService.getLoARejectionRiskRateTrend(
            undefined,
            tenantId,
          );
      }
    } else if (risk_group === 'Contract') {
      if (risk_name === 'Penerimaan terlambat') {
        const summary = await this.crmContractService.getLateDeliverySummary(
          undefined,
          tenantId,
        );
        riskRate = summary.late_delivery_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmContractService.getLateDeliveryRiskRateTrend(
            undefined,
            tenantId,
          );
      } else if (risk_name === 'Jumlah diterima tidak sesuai') {
        const summary =
          await this.crmContractService.getQuantityMismatchSummary(
            undefined,
            tenantId,
          );
        riskRate = summary.mismatch_rate;
        // DIHAPUS: forecast integration
        riskRateTrend =
          await this.crmContractService.getQuantityMismatchRiskRateTrend(
            undefined,
            tenantId,
          );
      }
    }

    // DIHAPUS: return forecastPrediction
    return { riskRate, riskRateTrend, success: true };
  }

  /**
   * Mendapatkan data spesifik gabungan identifikasi dan mitigasi risiko
   */
  async getSpecificRiskIdentificationAndMitigation(
    req: Request,
    riskUser: string,
    riskName: string,
    tenantId?: number,
  ): Promise<RiskIdentificationMitigationResult | null> {
    try {
      const results = await this.getRiskIdentificationAndMitigation(
        req,
        riskUser,
        tenantId,
      );
      return results.find((result) => result.risk_name === riskName) || null;
    } catch (error) {
      console.error(
        'Error in getSpecificRiskIdentificationAndMitigation:',
        error,
      );
      return null;
    }
  }

  /**
   * Menghitung prioritas risiko berdasarkan risk rate
   */
  private calculateRiskPriority(riskRate: number | null): string {
    if (riskRate === null) return 'Data Risk Rate tidak tersedia';
    if (riskRate >= 71) return 'Tinggi';
    if (riskRate >= 36) return 'Sedang';
    return 'Rendah';
  }

  /**
   * Menghitung efektivitas mitigasi berdasarkan trend
   */
  private calculateMitigationEffectivity(
    riskRateTrend: RiskRateTrendData[],
  ): number | string {
    try {
      const sortedTrend = [...riskRateTrend].sort(
        (a, b) => parseInt(b.year) - parseInt(a.year),
      );
      const currentYearRate = sortedTrend[0].value;
      const previousYearRate = sortedTrend[1].value;

      if (previousYearRate > 0 && currentYearRate < previousYearRate) {
        const rateDecrease = previousYearRate - currentYearRate;
        return parseFloat(((rateDecrease / previousYearRate) * 100).toFixed(2));
      }
      return 0;
    } catch (error) {
      console.error('Error calculating mitigation effectivity:', error);
      return 'Gagal mendapatkan data risiko';
    }
  }

  // DIHAPUS: calculateForecastPrediction method
}
