// business-layer\services\risk_mitigation.service.ts

import { Request } from 'express';
import { InventoryService } from './erp_inventory.service';
import { ManufacturingService } from './erp_manufacturing.service';
import { SRMProcurementService } from './srm_procurement.service';
import { SRMContractService } from './srm_contract.service';
import { CRMRequisitionService } from './crm_requisition.service';
import { CRMContractService } from './crm_contract.service';
import { RiskBaseService } from './risk_base.service';
import { RiskRateTrendData } from './risk_monitoring.service';

// Interface untuk hasil mitigasi risiko
export interface RiskMitigationResult {
  pkid?: string | number;
  risk_name: string;
  risk_desc: string;
  risk_user: string;
  risk_group: string;
  risk_mitigation: string;
  tenant_id?: string;
  mitigation_effectivity: number | string;
}

export class RiskMitigationService {
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
   * Mendapatkan data mitigasi risiko berdasarkan user dan tenant
   * @param req Request object
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @param tenantId ID tenant
   * @returns Data mitigasi risiko
   */
  async getRiskMitigation(
    req: Request,
    riskUser: string,
    tenantId?: number,
  ): Promise<RiskMitigationResult[]> {
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

      const riskMitigationList: RiskMitigationResult[] = [];

      for (const riskBase of riskBaseList) {
        try {
          const { pkid, risk_name, risk_desc, risk_group, risk_mitigation } =
            riskBase;

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
              riskRateTrend = result.riskRateTrend;
              riskRateTrendSuccess = result.success;
            } else if (normalizedRiskUser === 'supplier') {
              const result = await this.processSupplierRisk(
                req,
                risk_group,
                risk_name,
                tenantId,
              );
              riskRateTrend = result.riskRateTrend;
              riskRateTrendSuccess = result.success;
            } else if (normalizedRiskUser === 'retail') {
              const result = await this.processRetailRisk(
                req,
                risk_group,
                risk_name,
                tenantId,
              );
              riskRateTrend = result.riskRateTrend;
              riskRateTrendSuccess = result.success;
            }
          } catch (dataError) {
            console.error(
              `Error fetching data for risk ${risk_name}:`,
              dataError,
            );
            riskRateTrendSuccess = false;
          }

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

          riskMitigationList.push({
            pkid,
            risk_name,
            risk_desc,
            risk_user: riskUser,
            risk_group,
            risk_mitigation,
            tenant_id: risk_tenant_id,
            mitigation_effectivity: mitigationEffectivity,
          });
        } catch (riskError) {
          console.error(`Error processing risk:`, riskError);
          if (riskBase) {
            riskMitigationList.push({
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
              mitigation_effectivity: 'Gagal mendapatkan data risiko',
            });
          }
        }
      }

      return riskMitigationList;
    } catch (error) {
      console.error('Error in getRiskMitigation:', error);
      return [];
    }
  }

  /**
   * Memproses risiko untuk Industry
   */
  private async processIndustryRisk(
    req: Request,
    risk_group: string,
    risk_name: string,
    tenantId?: number,
  ) {
    let riskRateTrend: RiskRateTrendData[] = [];

    if (risk_group === 'Inventory') {
      if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
        riskRateTrend = await this.inventoryService.getReceiveRiskRateTrend(
          req,
          tenantId,
        );
      } else if (risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)') {
        riskRateTrend = await this.inventoryService.getTransferRiskRateTrend(
          req,
          tenantId,
        );
      }
    } else if (risk_group === 'Manufacturing') {
      if (risk_name === 'Produk Cacat') {
        riskRateTrend = await this.manufacturingService.getDefectRiskRateTrend(
          req,
          tenantId,
        );
      }
    } else if (risk_group === 'SRM Procurement') {
      if (risk_name === 'Penolakan Direct RFQ') {
        riskRateTrend =
          await this.srmProcurementService.getRFQLossRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      }
    } else if (risk_group === 'SRM Contract') {
      if (risk_name === 'Penerimaan terlambat') {
        riskRateTrend =
          await this.srmContractService.getLateReceiptRiskRateTrend(
            req,
            undefined,
            tenantId,
          );
      } else if (risk_name === 'Jumlah diterima tidak sesuai') {
        riskRateTrend =
          await this.srmContractService.getQuantityMismatchRiskRateTrend(
            req,
            undefined,
            tenantId,
          );
      }
    } else if (risk_group === 'CRM Requisition') {
      if (risk_name === 'Penolakan LoR') {
        riskRateTrend =
          await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Penolakan LoA') {
        riskRateTrend =
          await this.crmRequisitionService.getLoARejectionRiskRateTrend(
            tenantId,
            undefined,
          );
      }
    } else if (risk_group === 'CRM Contract') {
      if (risk_name === 'Penurunan jumlah kontrak') {
        riskRateTrend =
          await this.crmContractService.getContractDeclineRiskRateTrend(
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Pengiriman terlambat') {
        riskRateTrend =
          await this.crmContractService.getLateDeliveryRiskRateTrend(
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
        riskRateTrend =
          await this.crmContractService.getQuantityMismatchRiskRateTrend(
            tenantId,
            undefined,
          );
      }
    }

    return { riskRateTrend, success: true };
  }

  /**
   * Memproses risiko untuk Supplier
   */
  private async processSupplierRisk(
    req: Request,
    risk_group: string,
    risk_name: string,
    tenantId?: number,
  ) {
    let riskRateTrend: RiskRateTrendData[] = [];

    if (risk_group === 'Procurement') {
      if (risk_name === 'Kekalahan pada proses RFQ') {
        riskRateTrend =
          await this.srmProcurementService.getRFQLossRiskRateTrend(
            req,
            undefined,
            tenantId,
          );
      }
    } else if (risk_group === 'Contract') {
      if (risk_name === 'Penurunan jumlah kontrak') {
        riskRateTrend =
          await this.srmContractService.getContractDeclineRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Pengiriman terlambat') {
        riskRateTrend =
          await this.srmContractService.getLateReceiptRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
        riskRateTrend =
          await this.srmContractService.getQuantityMismatchRiskRateTrend(
            req,
            tenantId,
            undefined,
          );
      }
    }

    return { riskRateTrend, success: true };
  }

  /**
   * Memproses risiko untuk Retail
   */
  private async processRetailRisk(
    req: Request,
    risk_group: string,
    risk_name: string,
    tenantId?: number,
  ) {
    let riskRateTrend: RiskRateTrendData[] = [];

    if (risk_group === 'Requisition') {
      if (risk_name === 'Penolakan LoR') {
        riskRateTrend =
          await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
            undefined,
            tenantId,
          );
      } else if (risk_name === 'Penolakan LoA') {
        riskRateTrend =
          await this.crmRequisitionService.getLoARejectionRiskRateTrend(
            undefined,
            tenantId,
          );
      }
    } else if (risk_group === 'Contract') {
      if (risk_name === 'Penerimaan terlambat') {
        riskRateTrend =
          await this.crmContractService.getLateDeliveryRiskRateTrend(
            undefined,
            tenantId,
          );
      } else if (risk_name === 'Jumlah diterima tidak sesuai') {
        riskRateTrend =
          await this.crmContractService.getQuantityMismatchRiskRateTrend(
            undefined,
            tenantId,
          );
      }
    }

    return { riskRateTrend, success: true };
  }

  /**
   * Mendapatkan data mitigasi risiko berdasarkan PKID
   * @param req Request object
   * @param pkid ID dari risk mitigation
   * @param riskUser Tipe user (Industry, Supplier, Retail) - opsional untuk validasi
   * @param tenantId ID tenant - opsional untuk validasi
   * @returns Data mitigasi untuk risiko berdasarkan PKID
   */
  async getRiskMitigationByPkid(
    req: Request,
    pkid: number,
    riskUser?: string,
    tenantId?: number,
  ): Promise<RiskMitigationResult | null> {
    try {
      const searchCriteria: Record<string, string | number | undefined> = {
        pkid: pkid,
      };

      if (riskUser !== undefined) {
        searchCriteria.risk_user = riskUser;
      }

      if (tenantId !== undefined) {
        searchCriteria.tenant_id = tenantId;
      }

      console.log('Search criteria for PKID:', searchCriteria);

      const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        searchCriteria,
      );

      if (riskBaseList.length === 0) {
        return null;
      }

      const riskBase = riskBaseList[0];
      const { risk_name, risk_desc, risk_group, risk_mitigation } = riskBase;

      let mitigationEffectivity: number | string =
        'Gagal mendapatkan data risiko';
      let riskRateTrend: RiskRateTrendData[] = [];
      let riskRateTrendSuccess = false;

      const normalizedRiskUser = (riskUser || riskBase.risk_user).toLowerCase();

      try {
        if (normalizedRiskUser === 'industry') {
          const result = await this.processIndustryRisk(
            req,
            risk_group,
            risk_name,
            tenantId || riskBase.tenant_id,
          );
          riskRateTrend = result.riskRateTrend;
          riskRateTrendSuccess = result.success;
        } else if (normalizedRiskUser === 'supplier') {
          const result = await this.processSupplierRisk(
            req,
            risk_group,
            risk_name,
            tenantId || riskBase.tenant_id,
          );
          riskRateTrend = result.riskRateTrend;
          riskRateTrendSuccess = result.success;
        } else if (normalizedRiskUser === 'retail') {
          const result = await this.processRetailRisk(
            req,
            risk_group,
            risk_name,
            tenantId || riskBase.tenant_id,
          );
          riskRateTrend = result.riskRateTrend;
          riskRateTrendSuccess = result.success;
        }
      } catch (dataError) {
        console.error(`Error fetching data for risk ${risk_name}:`, dataError);
        riskRateTrendSuccess = false;
      }

      if (riskRateTrendSuccess && riskRateTrend && riskRateTrend.length >= 2) {
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

      return {
        pkid,
        risk_name,
        risk_desc,
        risk_user: riskBase.risk_user,
        risk_group,
        risk_mitigation,
        tenant_id: risk_tenant_id,
        mitigation_effectivity: mitigationEffectivity,
      };
    } catch (error) {
      console.error('Error in getRiskMitigationByPkid:', error);
      return null;
    }
  }

  /**
   * Mendapatkan data mitigasi untuk risiko spesifik
   * @param req Request object
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @param riskName Nama risiko
   * @param tenantId ID tenant
   * @returns Data mitigasi untuk risiko spesifik
   */
  async getSpecificRiskMitigation(
    req: Request,
    riskUser: string,
    riskName: string,
    tenantId?: number,
  ): Promise<RiskMitigationResult | null> {
    try {
      const results = await this.getRiskMitigation(req, riskUser, tenantId);
      return results.find((result) => result.risk_name === riskName) || null;
    } catch (error) {
      console.error('Error in getSpecificRiskMitigation:', error);
      return null;
    }
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
}
