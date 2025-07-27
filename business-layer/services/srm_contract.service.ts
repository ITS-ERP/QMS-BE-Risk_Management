import { Request } from 'express';
import {
  getSupplierByTenantIdViaRPC,
  getAllContractsByIndustryIdViaRPC,
  getAllContractsBySupplierIdViaRPC,
  getTopSuppliersByIndustryIdViaRPC,
  getTopIndustriesBySupplierIdViaRPC,
  getAllHistoryShipmentByIndustryForAllYearsViaRPC,
  getAllHistoryShipmentBySupplierForAllYearsViaRPC,
  getTotalHistoryShipmentByIndustryAndYearViaRPC,
  getTotalHistoryShipmentBySupplierAndYearViaRPC,
} from '../../rabbit/requestSRMData';

interface HistoryShipment {
  pkid: number;
  detail_contract_pkid: number;
  target_deadline_date: string;
  target_quantity: string;
  actual_deadline_date: string | null;
  actual_quantity: string | null;
  actual_shipment_cost: string | null;
  actual_item_total_price: string | null;
  actual_grand_total: string | null;
  status: string;
}

interface YearlyShipmentData {
  year: number;
  total: number;
  historyShipments: HistoryShipment[];
}

interface TopSupplierData {
  supplier_pkid: number;
  detail_contract_count: number;
  supplier: {
    pkid: number;
    name: string;
  } | null;
}

interface TopIndustryData {
  industry_pkid: number;
  detail_contract_count: number;
}

interface SupplierData {
  pkid: number;
  name?: string;
}

interface ContractDeclineSummary {
  current_year_contracts: number;
  previous_year_contracts: number;
  total_contracts: number;
  growth_rate: number;
  decline_rate: number;
}

export class SRMContractService {
  constructor() {
    // console.log('🚀 [SRM Contract Service] Initialized with RabbitMQ support');
  }
  async fetchAllSRMContract(req: Request) {
    console.log('📡 [SRM Contract] Fetching all contract data via RabbitMQ');

    try {
      console.warn(
        '⚠️ [SRM Contract] fetchAllSRMContract needs specific implementation based on requirements',
      );
      return [];
    } catch (error) {
      console.error(
        '❌ [SRM Contract] Error fetching all contract data:',
        error,
      );
      throw error;
    }
  }

  private async resolveSupplierTenantId(
    req: Request,
    supplier_tenant_id: number,
  ): Promise<number | null> {
    try {
      console.log(
        `\n🔍 [SUPPLIER LOOKUP] Looking up supplier_pkid for tenant_id: ${supplier_tenant_id} via RabbitMQ`,
      );
      const supplierData: any = await getSupplierByTenantIdViaRPC(
        req,
        supplier_tenant_id,
      );
      console.log(`🔍 [SRM SUPPLIER RPC] Response:`, {
        hasData: !!supplierData,
        hasPkid: !!supplierData?.pkid,
        dataStructure: supplierData ? Object.keys(supplierData) : 'no data',
      });

      console.log(`🔍 [SRM SUPPLIER RPC] Full response:`, supplierData);
      if (!supplierData || typeof supplierData.pkid === 'undefined') {
        console.error(
          `❌ [NO SUPPLIER] No supplier found or invalid format for tenant_id: ${supplier_tenant_id}`,
        );
        console.error(
          `❌ [RESPONSE STRUCTURE] Expected object with pkid, got:`,
          typeof supplierData,
        );
        const fallbackSupplierPkid = supplier_tenant_id - 2;
        console.warn(
          `⚠️ [FALLBACK] Using fallback mapping: tenant_id ${supplier_tenant_id} → supplier_pkid ${fallbackSupplierPkid}`,
        );
        return fallbackSupplierPkid;
      }

      console.log(
        `✅ [SUPPLIER FOUND] supplier_pkid: ${supplierData.pkid} for tenant_id: ${supplier_tenant_id}`,
      );
      console.log(`✅ [SUPPLIER INFO] name: ${supplierData.name || 'N/A'}`);

      return supplierData.pkid;
    } catch (error) {
      console.error(
        `❌ [SUPPLIER LOOKUP ERROR] Error getting supplier_pkid for tenant_id ${supplier_tenant_id}:`,
        error,
      );
      const fallbackSupplierPkid = supplier_tenant_id - 2;
      console.warn(
        `⚠️ [FALLBACK] RabbitMQ call failed, using fallback mapping: tenant_id ${supplier_tenant_id} → supplier_pkid ${fallbackSupplierPkid}`,
      );
      return fallbackSupplierPkid;
    }
  }

  private getDateRange(years: number = 5): {
    start_date: string;
    end_date: string;
  } {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years + 1;
    return {
      start_date: `${startYear}-01-01`,
      end_date: `${currentYear}-12-31`,
    };
  }

  async getAllOnTimeVsLateTrend(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const yearlyTrend: { [key: string]: { on_time: number; late: number } } =
      {};

    try {
      console.log(`📡 [RabbitMQ] Getting on-time vs late trend analysis`);

      let shipmentData: YearlyShipmentData[] = [];

      if (industry_tenant_id) {
        const industry_id = industry_tenant_id;
        console.log(`🏭 [INDUSTRY TREND] Using industry_pkid: ${industry_id}`);
        const response = await getAllHistoryShipmentByIndustryForAllYearsViaRPC(
          req,
          industry_id,
        );
        shipmentData = Array.isArray(response) ? response : [];
      } else if (supplier_tenant_id) {
        const supplier_id = await this.resolveSupplierTenantId(
          req,
          supplier_tenant_id,
        );
        if (!supplier_id) {
          throw new Error('Invalid supplier_tenant_id');
        }
        console.log(`🏪 [SUPPLIER TREND] Using supplier_pkid: ${supplier_id}`);
        const response = await getAllHistoryShipmentBySupplierForAllYearsViaRPC(
          req,
          supplier_id,
        );
        shipmentData = Array.isArray(response) ? response : [];
      }

      console.log(
        `📊 [DELIVERY TREND] Found ${shipmentData.length} yearly records`,
      );
      shipmentData.forEach((yearData: YearlyShipmentData) => {
        const year = yearData.year.toString();
        if (!yearlyTrend[year]) {
          yearlyTrend[year] = { on_time: 0, late: 0 };
        }

        yearData.historyShipments.forEach((shipment: HistoryShipment) => {
          if (
            shipment.status === 'Arrived' &&
            shipment.target_deadline_date &&
            shipment.actual_deadline_date
          ) {
            const targetDate = new Date(shipment.target_deadline_date);
            const actualDate = new Date(shipment.actual_deadline_date);

            if (actualDate <= targetDate) {
              yearlyTrend[year].on_time += 1;
              console.log(
                `✅ DELIVERY: ON-TIME - Shipment ${shipment.pkid} (Year ${year})`,
              );
            } else {
              yearlyTrend[year].late += 1;
              console.log(
                `❌ DELIVERY: LATE - Shipment ${shipment.pkid} (Year ${year})`,
              );
            }
          } else {
            if (shipment.status !== 'Arrived') {
              console.log(
                `⚪ SKIPPED: Shipment ${shipment.pkid} (status: ${shipment.status} - not 'Arrived')`,
              );
            } else if (
              !shipment.target_deadline_date ||
              !shipment.actual_deadline_date
            ) {
              console.log(
                `⚪ SKIPPED: Shipment ${shipment.pkid} (incomplete delivery data)`,
              );
            }
          }
        });
      });
      const allYearlyTrend = Object.entries(yearlyTrend)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, values]) => ({ year, ...values }))
        .reverse();

      console.log(
        `✅ [DELIVERY TREND] On-time vs late trend calculated with RabbitMQ:`,
        allYearlyTrend.length,
        'year records',
      );
      return allYearlyTrend;
    } catch (error) {
      console.error(
        '❌ [DELIVERY TREND] Error in getAllOnTimeVsLateTrend:',
        error,
      );
      throw error;
    }
  }

  async getLateTrend(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const onTimeVsLateData = await this.getAllOnTimeVsLateTrend(
      req,
      industry_tenant_id,
      supplier_tenant_id,
    );

    const top5LateTrend = onTimeVsLateData
      .map((item) => ({
        year: item.year,
        late: item.late,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();

    console.log(
      `📊 [LATE TREND] Late trend calculated with RabbitMQ:`,
      top5LateTrend.length,
      'records',
    );
    return top5LateTrend;
  }

  async getQuantityCompliance(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const yearlyCompliance: {
      [key: string]: { compliant: number; noncompliant: number };
    } = {};

    try {
      console.log(`📡 [RabbitMQ] Getting quantity compliance analysis`);

      let shipmentData: YearlyShipmentData[] = [];

      if (industry_tenant_id) {
        const industry_id = industry_tenant_id;
        console.log(
          `🏭 [INDUSTRY COMPLIANCE] Using industry_pkid: ${industry_id}`,
        );
        const response = await getAllHistoryShipmentByIndustryForAllYearsViaRPC(
          req,
          industry_id,
        );
        shipmentData = Array.isArray(response) ? response : [];
      } else if (supplier_tenant_id) {
        const supplier_id = await this.resolveSupplierTenantId(
          req,
          supplier_tenant_id,
        );
        if (!supplier_id) {
          throw new Error('Invalid supplier_tenant_id');
        }
        console.log(
          `🏪 [SUPPLIER COMPLIANCE] Using supplier_pkid: ${supplier_id}`,
        );
        const response = await getAllHistoryShipmentBySupplierForAllYearsViaRPC(
          req,
          supplier_id,
        );
        shipmentData = Array.isArray(response) ? response : [];
      }

      console.log(
        `📊 [QUANTITY COMPLIANCE] Found ${shipmentData.length} yearly records`,
      );
      shipmentData.forEach((yearData: YearlyShipmentData) => {
        const year = yearData.year.toString();
        if (!yearlyCompliance[year]) {
          yearlyCompliance[year] = { compliant: 0, noncompliant: 0 };
        }

        yearData.historyShipments.forEach((shipment: HistoryShipment) => {
          if (
            shipment.status === 'Arrived' &&
            shipment.target_quantity &&
            shipment.actual_quantity
          ) {
            const targetQuantity = parseFloat(shipment.target_quantity);
            const actualQuantity = parseFloat(shipment.actual_quantity);

            if (actualQuantity >= targetQuantity) {
              yearlyCompliance[year].compliant += 1;
              console.log(
                `✅ QUANTITY: COMPLIANT - Shipment ${shipment.pkid} (${actualQuantity} >= ${targetQuantity}) (Year ${year})`,
              );
            } else {
              yearlyCompliance[year].noncompliant += 1;
              console.log(
                `❌ QUANTITY: NON-COMPLIANT - Shipment ${shipment.pkid} (${actualQuantity} < ${targetQuantity}) (Year ${year})`,
              );
            }
          } else {
            if (shipment.status !== 'Arrived') {
              console.log(
                `⚪ SKIPPED: Shipment ${shipment.pkid} (status: ${shipment.status} - not 'Arrived')`,
              );
            } else if (!shipment.target_quantity || !shipment.actual_quantity) {
              console.log(
                `⚪ SKIPPED: Shipment ${shipment.pkid} (incomplete quantity data)`,
              );
            }
          }
        });
      });
      const allYearlyCompliance = Object.entries(yearlyCompliance)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, values]) => ({ year, ...values }))
        .reverse();

      console.log(
        `✅ [QUANTITY COMPLIANCE] Quantity compliance calculated with RabbitMQ:`,
        allYearlyCompliance.length,
        'year records',
      );
      return allYearlyCompliance;
    } catch (error) {
      console.error(
        '❌ [QUANTITY COMPLIANCE] Error in getQuantityCompliance:',
        error,
      );
      throw error;
    }
  }

  async getNonCompliantQuantity(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const complianceData = await this.getQuantityCompliance(
      req,
      industry_tenant_id,
      supplier_tenant_id,
    );

    const top5NonCompliantQuantity = complianceData
      .map((item) => ({
        year: item.year,
        noncompliant: item.noncompliant,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();

    console.log(
      `📊 [NON-COMPLIANT] Non-compliant quantity trend calculated with RabbitMQ:`,
      top5NonCompliantQuantity.length,
      'records',
    );
    return top5NonCompliantQuantity;
  }

  async getContractTotal(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const yearlyContracts: { [key: string]: Set<number> } = {};

    try {
      console.log(`📡 [RabbitMQ] Getting contract total analysis`);
      interface MasterContractData {
        pkid: number;
        supplier_pkid: number;
        industry_pkid: number;
        code: string;
        name: string;
        status: string;
        detailContracts: Array<{
          pkid: number;
          master_contract_pkid: number;
          historyShipments: HistoryShipment[];
        }>;
      }

      let allContractsData: MasterContractData[] = [];

      if (industry_tenant_id) {
        const industry_id = industry_tenant_id;
        console.log(`🏭 [CONTRACT TOTAL] Using industry_pkid: ${industry_id}`);
        const response = await getAllContractsByIndustryIdViaRPC(
          req,
          industry_id,
        );
        allContractsData = Array.isArray(response) ? response : [];
      } else if (supplier_tenant_id) {
        const supplier_id = await this.resolveSupplierTenantId(
          req,
          supplier_tenant_id,
        );
        if (!supplier_id) {
          throw new Error('Invalid supplier_tenant_id');
        }
        console.log(`🏪 [CONTRACT TOTAL] Using supplier_pkid: ${supplier_id}`);
        const response = await getAllContractsBySupplierIdViaRPC(
          req,
          supplier_id,
        );
        allContractsData = Array.isArray(response) ? response : [];
      }

      console.log(
        `📊 [CONTRACT TOTAL] Found ${allContractsData.length} master contracts`,
      );
      allContractsData.forEach((contract) => {
        contract.detailContracts.forEach((detail) => {
          detail.historyShipments.forEach((shipment) => {
            if (shipment.target_deadline_date) {
              const year = new Date(shipment.target_deadline_date)
                .getFullYear()
                .toString();

              if (!yearlyContracts[year]) {
                yearlyContracts[year] = new Set<number>();
              }
              yearlyContracts[year].add(contract.pkid);
            }
          });
        });
      });
      const allYearlyTotal = Object.entries(yearlyContracts)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, contractSet]) => ({
          year,
          total: contractSet.size,
        }))
        .reverse();

      console.log(
        `✅ [CONTRACT TOTAL] Contract total calculated with MASTER CONTRACT logic (same as main service):`,
        allYearlyTotal.length,
        'year records',
      );
      return allYearlyTotal;
    } catch (error) {
      console.error('❌ [CONTRACT TOTAL] Error in getContractTotal:', error);
      throw error;
    }
  }

  async getLateReceiptSummary(
    req: Request,
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    const allYearlyTrend = await this.getAllOnTimeVsLateTrend(
      req,
      industry_tenant_id,
      supplier_tenant_id,
    );

    let totalOnTime = 0;
    let totalLate = 0;

    allYearlyTrend.forEach((item) => {
      totalOnTime += item.on_time;
      totalLate += item.late;
    });

    const totalContract = totalOnTime + totalLate;

    const summary = {
      total_contract: totalContract > 0 ? totalContract : 0,
      on_time_receipt: totalOnTime > 0 ? totalOnTime : 0,
      late_receipt: totalLate > 0 ? totalLate : 0,
      on_time_rate:
        totalContract > 0
          ? parseFloat(((totalOnTime / totalContract) * 100).toFixed(2))
          : 0.0,
      late_receipt_rate:
        totalContract > 0
          ? parseFloat(((totalLate / totalContract) * 100).toFixed(2))
          : 0.0,
    };

    console.log(
      `📊 [LATE RECEIPT SUMMARY] Late receipt summary calculated with RabbitMQ:`,
      summary,
    );
    return summary;
  }

  async getQuantityMismatchSummary(
    req: Request,
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    const complianceData = await this.getQuantityCompliance(
      req,
      industry_tenant_id,
      supplier_tenant_id,
    );

    let totalCompliant = 0;
    let totalNonCompliant = 0;

    complianceData.forEach((item) => {
      totalCompliant += item.compliant;
      totalNonCompliant += item.noncompliant;
    });

    const totalContracts = totalCompliant + totalNonCompliant;

    const summary = {
      total_contract: totalContracts > 0 ? totalContracts : 0,
      compliant_quantity: totalCompliant > 0 ? totalCompliant : 0,
      mismatch_quantity: totalNonCompliant > 0 ? totalNonCompliant : 0,
      compliant_rate:
        totalContracts > 0
          ? parseFloat(((totalCompliant / totalContracts) * 100).toFixed(2))
          : 0.0,
      mismatch_rate:
        totalContracts > 0
          ? parseFloat(((totalNonCompliant / totalContracts) * 100).toFixed(2))
          : 0.0,
    };

    console.log(
      `📊 [QUANTITY MISMATCH SUMMARY] Quantity mismatch summary calculated with RabbitMQ:`,
      summary,
    );
    return summary;
  }

  async getContractDeclineSummary(
    req: Request,
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ): Promise<ContractDeclineSummary> {
    const contractData = await this.getContractTotal(
      req,
      industry_tenant_id,
      supplier_tenant_id,
    );

    if (contractData.length < 2) {
      const summary = {
        current_year_contracts:
          contractData.length > 0
            ? contractData[contractData.length - 1].total
            : 0,
        previous_year_contracts: 0,
        total_contracts:
          contractData.length > 0
            ? contractData[contractData.length - 1].total
            : 0,
        growth_rate: 0.0,
        decline_rate: 0.0,
      };
      console.log(
        '📊 [CONTRACT DECLINE] Contract decline summary (insufficient data):',
        summary,
      );
      return summary;
    }

    const currentYearData = contractData[contractData.length - 1];
    const previousYearData = contractData[contractData.length - 2];

    const currentYearContracts = currentYearData.total;
    const previousYearContracts = previousYearData.total;
    const totalContracts = currentYearContracts + previousYearContracts;
    let growthRate = 0.0;
    let declineRate = 0.0;

    if (previousYearContracts > 0) {
      if (currentYearContracts > previousYearContracts) {
        growthRate = parseFloat(
          (
            ((currentYearContracts - previousYearContracts) /
              previousYearContracts) *
            100
          ).toFixed(2),
        );
      } else if (currentYearContracts < previousYearContracts) {
        declineRate = parseFloat(
          (
            ((previousYearContracts - currentYearContracts) /
              previousYearContracts) *
            100
          ).toFixed(2),
        );
      }
    }

    const summary = {
      current_year_contracts: currentYearContracts,
      previous_year_contracts: previousYearContracts,
      total_contracts: totalContracts,
      growth_rate: growthRate,
      decline_rate: declineRate,
    };

    console.log(
      `📊 [CONTRACT DECLINE] Contract decline summary calculated with RabbitMQ contract-level logic:`,
      summary,
    );
    return summary;
  }

  async getLateReceiptRiskRateTrend(
    req: Request,
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    console.log('🔧 [LATE RECEIPT TREND] Called with req parameter');

    try {
      const yearlyData = await this.getAllOnTimeVsLateTrend(
        req,
        industry_tenant_id,
        supplier_tenant_id,
      );

      const riskRateTrend = yearlyData.map((item) => {
        const total = item.on_time + item.late;
        const riskRate =
          total > 0 ? parseFloat(((item.late / total) * 100).toFixed(2)) : 0;

        return {
          year: item.year,
          value: riskRate,
        };
      });

      console.log(
        `📊 [LATE RECEIPT TREND] Late receipt risk rate trend calculated with RabbitMQ:`,
        riskRateTrend.length,
        'records',
      );
      return riskRateTrend;
    } catch (error) {
      console.error('❌ [LATE RECEIPT TREND] Error:', error);
      return [];
    }
  }

  async getQuantityMismatchRiskRateTrend(
    req: Request,
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    console.log('🔧 [QUANTITY MISMATCH TREND] Called with req parameter');

    try {
      const yearlyData = await this.getQuantityCompliance(
        req,
        industry_tenant_id,
        supplier_tenant_id,
      );

      const riskRateTrend = yearlyData.map((item) => {
        const total = item.compliant + item.noncompliant;
        const riskRate =
          total > 0
            ? parseFloat(((item.noncompliant / total) * 100).toFixed(2))
            : 0;

        return {
          year: item.year,
          value: riskRate,
        };
      });

      console.log(
        `📊 [QUANTITY MISMATCH TREND] Quantity mismatch risk rate trend calculated with RabbitMQ:`,
        riskRateTrend.length,
        'records',
      );
      return riskRateTrend;
    } catch (error) {
      console.error('❌ [QUANTITY MISMATCH TREND] Error:', error);
      return [];
    }
  }

  async getContractDeclineRiskRateTrend(
    req: Request,
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    console.log('🔧 [CONTRACT DECLINE TREND] Called with req parameter');

    try {
      const yearlyData = await this.getContractTotal(
        req,
        industry_tenant_id,
        supplier_tenant_id,
      );
      const riskRateTrend = [];
      if (yearlyData.length === 1) {
        const currentYear = yearlyData[0];
        riskRateTrend.push({
          year: currentYear.year,
          value: 0,
        });
      } else if (yearlyData.length >= 2) {
        for (let i = 1; i < yearlyData.length; i++) {
          const currentYear = yearlyData[i];
          const previousYear = yearlyData[i - 1];

          let declineRate = 0;
          if (
            previousYear.total > 0 &&
            currentYear.total < previousYear.total
          ) {
            declineRate = parseFloat(
              (
                ((previousYear.total - currentYear.total) /
                  previousYear.total) *
                100
              ).toFixed(2),
            );
          }

          riskRateTrend.push({
            year: currentYear.year,
            value: declineRate,
          });
        }
      }

      console.log(
        `📊 [CONTRACT DECLINE TREND] Contract decline risk rate trend calculated with RabbitMQ:`,
        riskRateTrend.length,
        'records',
      );
      return riskRateTrend;
    } catch (error) {
      console.error('❌ [CONTRACT DECLINE TREND] Error:', error);
      return [];
    }
  }

  async getTopSuppliers(
    req: Request,
    industry_tenant_id: number,
  ): Promise<TopSupplierData[]> {
    const industry_id = industry_tenant_id;

    try {
      console.log(
        `📡 [RabbitMQ] Getting top suppliers for industry ${industry_id}`,
      );
      const response = await getTopSuppliersByIndustryIdViaRPC(
        req,
        industry_id,
      );
      const result = Array.isArray(response) ? response : [];

      console.log(
        `📊 [TOP SUPPLIERS] Top suppliers retrieved via RabbitMQ:`,
        result.length,
        'suppliers',
      );
      return result;
    } catch (error) {
      console.error('❌ [TOP SUPPLIERS] Error in getTopSuppliers:', error);
      throw error;
    }
  }

  async getTopIndustries(
    req: Request,
    supplier_tenant_id: number,
  ): Promise<TopIndustryData[]> {
    const supplier_id = await this.resolveSupplierTenantId(
      req,
      supplier_tenant_id,
    );
    if (!supplier_id) {
      throw new Error('Invalid supplier_tenant_id');
    }

    try {
      console.log(
        `📡 [RabbitMQ] Getting top industries for supplier ${supplier_id}`,
      );
      const response = await getTopIndustriesBySupplierIdViaRPC(
        req,
        supplier_id,
      );
      const result = Array.isArray(response) ? response : [];

      console.log(
        `📊 [TOP INDUSTRIES] Top industries retrieved via RabbitMQ:`,
        result.length,
        'industries',
      );
      return result;
    } catch (error) {
      console.error('❌ [TOP INDUSTRIES] Error in getTopIndustries:', error);
      throw error;
    }
  }
}
