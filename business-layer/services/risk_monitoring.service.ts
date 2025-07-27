import { Request } from 'express';
import { InventoryService } from './erp_inventory.service';
import { ManufacturingService } from './erp_manufacturing.service';
import { SRMProcurementService } from './srm_procurement.service';
import { SRMContractService } from './srm_contract.service';
import { CRMRequisitionService } from './crm_requisition.service';
import { CRMContractService } from './crm_contract.service';
import { RiskBaseService } from './risk_base.service';
export interface RiskRateTrendData {
  year: string;
  value: number;
}
export interface RiskMonitoringResult {
  risk_name: string;
  risk_desc: string;
  risk_group: string;
  trend_data: RiskRateTrendData[];
}

export class RiskMonitoringService {
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

  async getRiskMonitoring(
    req: Request,
    riskUser: string,
    industryTenantId?: number,
    supplierTenantId?: number,
    retailTenantId?: number,
  ): Promise<RiskMonitoringResult[]> {
    try {
      console.log(`[RiskMonitoring] Getting risk monitoring for:`, {
        riskUser,
        industryTenantId,
        supplierTenantId,
        retailTenantId,
      });
      const riskBaseList = await this.riskBaseService.getTenantRiskBases(req);

      console.log(
        `[RiskMonitoring] Found ${riskBaseList.length} risk bases for authenticated tenant`,
      );
      const filteredRiskBaseList = riskBaseList.filter(
        (riskBase) =>
          riskBase.risk_user.toLowerCase() === riskUser.toLowerCase(),
      );
      const normalizedRiskUser = riskUser.toLowerCase();
      const desiredOrders: Record<string, string[]> = {
        industry: [
          'Ketidaksesuaian Jumlah (Received Items)',
          'Ketidaksesuaian Jumlah (Transferred Items)',
          'Produk Cacat',
          'Penolakan Direct RFQ',
          'Penerimaan terlambat',
          'Jumlah diterima tidak sesuai',
          'Penolakan LoR',
          'Penolakan LoA',
          'Penurunan jumlah kontrak',
          'Pengiriman terlambat',
          'Jumlah dikirim tidak sesuai',
        ],
        supplier: [
          'Kekalahan pada proses RFQ',
          'Penurunan jumlah kontrak',
          'Pengiriman terlambat',
          'Jumlah dikirim tidak sesuai',
        ],
        retail: [
          'Penolakan LoR',
          'Penolakan LoA',
          'Penerimaan terlambat',
          'Jumlah diterima tidak sesuai',
        ],
      };

      const desiredOrder = desiredOrders[normalizedRiskUser] || [];

      const sortedRiskBaseList = filteredRiskBaseList.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.risk_name);
        const indexB = desiredOrder.indexOf(b.risk_name);

        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });

      console.log(
        `[RiskMonitoring] Filtered to ${filteredRiskBaseList.length} risk bases for ${riskUser}`,
      );

      if (filteredRiskBaseList.length === 0) {
        console.log(
          `[RiskMonitoring] No risk bases found for ${riskUser} in current tenant`,
        );
        return [];
      }

      const riskMonitoringList: RiskMonitoringResult[] = [];
      for (const riskBase of sortedRiskBaseList) {
        try {
          const { risk_name, risk_desc, risk_group } = riskBase;

          console.log(
            `[RiskMonitoring] Processing risk: ${risk_name} (${risk_group}) - Tenant: ${riskBase.tenant_id}`,
          );
          let riskRateTrend: RiskRateTrendData[] = [];
          const normalizedRiskUser = riskUser.toLowerCase();

          try {
            riskRateTrend = await this.getTrendDataByRiskType(
              req,
              normalizedRiskUser,
              risk_group,
              risk_name,
              industryTenantId,
              supplierTenantId,
              retailTenantId,
            );

            console.log(
              `[RiskMonitoring] Got ${riskRateTrend.length} trend data points for ${risk_name}`,
            );
            if (riskRateTrend.length > 0) {
              console.log(
                `[RiskMonitoring] Sample trend data for ${risk_name}:`,
                riskRateTrend.slice(0, 2),
              );
            }
          } catch (trendError) {
            console.error(
              `Error fetching trend data for risk ${risk_name}:`,
              trendError,
            );
            riskRateTrend = [];
          }
          if (!riskRateTrend) {
            riskRateTrend = [];
          }
          riskMonitoringList.push({
            risk_name,
            risk_desc,
            risk_group,
            trend_data: riskRateTrend,
          });
        } catch (riskError) {
          console.error(`Error processing risk:`, riskError);
          if (riskBase) {
            riskMonitoringList.push({
              risk_name: riskBase.risk_name || 'Error retrieving risk name',
              risk_desc: riskBase.risk_desc || '',
              risk_group: riskBase.risk_group || '',
              trend_data: [],
            });
          }
        }
      }

      console.log(
        `[RiskMonitoring] Returning ${riskMonitoringList.length} risk monitoring results`,
      );
      return riskMonitoringList;
    } catch (error) {
      console.error('Error in getRiskMonitoring:', error);
      return [];
    }
  }

  /*
  async getRiskMonitoringManual(
    req: Request,
    riskUser: string,
    industryTenantId?: number,
    supplierTenantId?: number,
    retailTenantId?: number,
  ): Promise<RiskMonitoringResult[]> {
    try {
      console.log(`[RiskMonitoring] Getting risk monitoring for:`, {
        riskUser, industryTenantId, supplierTenantId, retailTenantId
      });
      const criteria: any = { risk_user: riskUser };
      if (riskUser.toLowerCase() === 'industry' && industryTenantId) {
        criteria.tenant_id = industryTenantId;
      } else if (riskUser.toLowerCase() === 'supplier' && supplierTenantId) {
        criteria.tenant_id = supplierTenantId;
      } else if (riskUser.toLowerCase() === 'retail' && retailTenantId) {
        criteria.tenant_id = retailTenantId;
      }

      console.log(`[RiskMonitoring] Query criteria:`, criteria);

      const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(req, criteria);
      
      console.log(`[RiskMonitoring] Found ${riskBaseList.length} risk bases for ${riskUser} with tenant filter`);
    } catch (error) {
      console.error('Error in getRiskMonitoring:', error);
      return [];
    }
  }
  */

  private async getTrendDataByRiskType(
    req: Request,
    normalizedRiskUser: string,
    risk_group: string,
    risk_name: string,
    industryTenantId?: number,
    supplierTenantId?: number,
    retailTenantId?: number,
  ): Promise<RiskRateTrendData[]> {
    console.log(
      `[TrendData] Getting trend for: ${normalizedRiskUser} - ${risk_group} - ${risk_name}`,
    );
    console.log(
      `[TrendData] Tenant IDs: industry=${industryTenantId}, supplier=${supplierTenantId}, retail=${retailTenantId}`,
    );

    if (normalizedRiskUser === 'industry') {
      return await this.getIndustryTrendData(
        req,
        risk_group,
        risk_name,
        industryTenantId,
      );
    } else if (normalizedRiskUser === 'supplier') {
      return await this.getSupplierTrendData(
        req,
        risk_group,
        risk_name,
        supplierTenantId,
      );
    } else if (normalizedRiskUser === 'retail') {
      return await this.getRetailTrendData(
        risk_group,
        risk_name,
        retailTenantId,
      );
    }

    return [];
  }

  private async getIndustryTrendData(
    req: Request,
    risk_group: string,
    risk_name: string,
    industryTenantId?: number,
  ): Promise<RiskRateTrendData[]> {
    console.log(
      `[IndustryTrend] Processing ${risk_group} - ${risk_name} for tenant ${industryTenantId}`,
    );

    if (risk_group === 'Inventory') {
      if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
        return await this.inventoryService.getReceiveRiskRateTrend(
          req,
          industryTenantId,
        );
      } else if (risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)') {
        return await this.inventoryService.getTransferRiskRateTrend(
          req,
          industryTenantId,
        );
      }
    } else if (risk_group === 'Manufacturing') {
      if (risk_name === 'Produk Cacat') {
        return await this.manufacturingService.getDefectRiskRateTrend(
          req,
          industryTenantId,
        );
      }
    } else if (risk_group === 'SRM Procurement') {
      if (risk_name === 'Penolakan Direct RFQ') {
        return await this.srmProcurementService.getRFQLossRiskRateTrend(
          req,
          industryTenantId,
          undefined,
        );
      }
    } else if (risk_group === 'SRM Contract') {
      if (risk_name === 'Penerimaan terlambat') {
        return await this.srmContractService.getLateReceiptRiskRateTrend(
          req,
          undefined,
          industryTenantId,
        );
      } else if (risk_name === 'Jumlah diterima tidak sesuai') {
        return await this.srmContractService.getQuantityMismatchRiskRateTrend(
          req,
          undefined,
          industryTenantId,
        );
      }
    } else if (risk_group === 'CRM Requisition') {
      if (risk_name === 'Penolakan LoR') {
        return await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
          industryTenantId,
          undefined,
        );
      } else if (risk_name === 'Penolakan LoA') {
        return await this.crmRequisitionService.getLoARejectionRiskRateTrend(
          industryTenantId,
          undefined,
        );
      }
    } else if (risk_group === 'CRM Contract') {
      if (risk_name === 'Penurunan jumlah kontrak') {
        return await this.crmContractService.getContractDeclineRiskRateTrend(
          industryTenantId,
          undefined,
        );
      } else if (risk_name === 'Pengiriman terlambat') {
        return await this.crmContractService.getLateDeliveryRiskRateTrend(
          industryTenantId,
          undefined,
        );
      } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
        return await this.crmContractService.getQuantityMismatchRiskRateTrend(
          industryTenantId,
          undefined,
        );
      }
    }

    return [];
  }

  private async getSupplierTrendData(
    req: Request,
    risk_group: string,
    risk_name: string,
    supplierTenantId?: number,
  ): Promise<RiskRateTrendData[]> {
    console.log(
      `[SupplierTrend] Processing ${risk_group} - ${risk_name} for tenant ${supplierTenantId}`,
    );

    if (risk_group === 'Procurement') {
      if (risk_name === 'Kekalahan pada proses RFQ') {
        return await this.srmProcurementService.getRFQLossRiskRateTrend(
          req,
          undefined,
          supplierTenantId,
        );
      }
    } else if (risk_group === 'Contract') {
      if (risk_name === 'Penurunan jumlah kontrak') {
        return await this.srmContractService.getContractDeclineRiskRateTrend(
          req,
          supplierTenantId,
          undefined,
        );
      } else if (risk_name === 'Pengiriman terlambat') {
        return await this.srmContractService.getLateReceiptRiskRateTrend(
          req,
          supplierTenantId,
          undefined,
        );
      } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
        return await this.srmContractService.getQuantityMismatchRiskRateTrend(
          req,
          supplierTenantId,
          undefined,
        );
      }
    }

    return [];
  }

  private async getRetailTrendData(
    risk_group: string,
    risk_name: string,
    retailTenantId?: number,
  ): Promise<RiskRateTrendData[]> {
    console.log(
      `[RetailTrend] Processing ${risk_group} - ${risk_name} for tenant ${retailTenantId}`,
    );

    if (risk_group === 'Requisition') {
      if (risk_name === 'Penolakan LoR') {
        return await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
          undefined,
          retailTenantId,
        );
      } else if (risk_name === 'Penolakan LoA') {
        return await this.crmRequisitionService.getLoARejectionRiskRateTrend(
          undefined,
          retailTenantId,
        );
      }
    } else if (risk_group === 'Contract') {
      if (risk_name === 'Penerimaan terlambat') {
        return await this.crmContractService.getLateDeliveryRiskRateTrend(
          undefined,
          retailTenantId,
        );
      } else if (risk_name === 'Jumlah diterima tidak sesuai') {
        return await this.crmContractService.getQuantityMismatchRiskRateTrend(
          undefined,
          retailTenantId,
        );
      }
    }

    return [];
  }

  async getSpecificRiskMonitoring(
    req: Request,
    riskUser: string,
    riskName: string,
    industryTenantId?: number,
    supplierTenantId?: number,
    retailTenantId?: number,
  ): Promise<RiskMonitoringResult | null> {
    try {
      console.log(`[SpecificRisk] Getting specific risk monitoring:`, {
        riskUser,
        riskName,
        industryTenantId,
        supplierTenantId,
        retailTenantId,
      });
      const riskBaseList = await this.riskBaseService.getTenantRiskBases(req);

      console.log(
        `[SpecificRisk] Found ${riskBaseList.length} risk bases for authenticated tenant`,
      );
      const specificRiskBase = riskBaseList.find(
        (riskBase) =>
          riskBase.risk_user.toLowerCase() === riskUser.toLowerCase() &&
          riskBase.risk_name === riskName,
      );

      if (!specificRiskBase) {
        console.log(
          `[SpecificRisk] No risk base found for ${riskUser} - ${riskName} in current tenant`,
        );
        return null;
      }

      const { risk_name, risk_desc, risk_group } = specificRiskBase;

      console.log(
        `[SpecificRisk] Found risk: ${risk_name} (${risk_group}) - Tenant: ${specificRiskBase.tenant_id}`,
      );
      const normalizedRiskUser = riskUser.toLowerCase();
      let riskRateTrend: RiskRateTrendData[] = [];

      try {
        riskRateTrend = await this.getTrendDataByRiskType(
          req,
          normalizedRiskUser,
          risk_group,
          risk_name,
          industryTenantId,
          supplierTenantId,
          retailTenantId,
        );

        console.log(
          `[SpecificRisk] Got ${riskRateTrend.length} trend data points for specific risk ${risk_name}`,
        );
      } catch (trendError) {
        console.error(
          `Error fetching trend data for specific risk ${risk_name}:`,
          trendError,
        );
        riskRateTrend = [];
      }
      if (!riskRateTrend) {
        riskRateTrend = [];
      }
      return {
        risk_name,
        risk_desc,
        risk_group,
        trend_data: riskRateTrend,
      };
    } catch (error) {
      console.error('Error in getSpecificRiskMonitoring:', error);
      return null;
    }
  }
}
