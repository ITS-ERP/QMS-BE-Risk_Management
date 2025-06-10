import * as srmContractIntegration from '../../data-access/integrations/srm_contract.integration';
import * as srmSupplierPortalIntegration from '../../data-access/integrations/srm_supplier_portal.integration';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

/**
 * SRM Contract Service for Risk Management - CORRECTED WITH STRICT LOGIC
 * Updated to work with new SRM integration system
 * Maintains same function names and response structures for compatibility
 */
export class SRMContractService {
  // ============================================================================
  // LEGACY COMPATIBILITY METHOD
  // ============================================================================
  async fetchAllSRMContract() {
    const response = await srmContractIntegration.getAllSRMContract();
    return response.data.data;
  }

  // ============================================================================
  // TENANT RESOLUTION HELPER
  // ============================================================================
  /**
   * Convert supplier_tenant_id to supplier_id using supplier portal API
   */
  private async resolveSupplierTenantId(
    supplier_tenant_id: number,
  ): Promise<number | null> {
    try {
      const response =
        await srmSupplierPortalIntegration.findSupplierByParamTenantID(
          supplier_tenant_id,
        );
      const supplierData = response.data.data as SupplierData;
      return supplierData?.pkid || null;
    } catch (error) {
      console.error('Failed to resolve supplier tenant ID:', error);
      return null;
    }
  }

  /**
   * Get date range for analysis (default: last 5 years)
   */
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

  // ============================================================================
  // DELIVERY PERFORMANCE ANALYSIS - CORRECTED WITH STRICT LOGIC
  // ============================================================================

  /**
   * Analyze on-time vs late delivery trend - CORRECTED STRICT LOGIC
   * Only analyzes shipments with status "Arrived" and complete delivery data
   */
  async getAllOnTimeVsLateTrend(
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const yearlyTrend: { [key: string]: { on_time: number; late: number } } =
      {};

    try {
      let shipmentData: YearlyShipmentData[] = [];

      if (industry_tenant_id) {
        const industry_id = industry_tenant_id; // Direct mapping
        // ✅ GANTI: Pakai endpoint AllYears (lebih simple)
        const response =
          await srmContractIntegration.findAllHistoryShipmentByIndustryForAllYears(
            industry_id,
          );
        shipmentData = response.data.data || [];
      } else if (supplier_tenant_id) {
        const supplier_id =
          await this.resolveSupplierTenantId(supplier_tenant_id);
        if (!supplier_id) {
          throw new Error('Invalid supplier_tenant_id');
        }
        // ✅ GANTI: Pakai endpoint AllYears (lebih simple)
        const response =
          await srmContractIntegration.findAllHistoryShipmentBySupplierForAllYears(
            supplier_id,
          );
        shipmentData = response.data.data || [];
      }

      // ✅ LOGIC TETAP SAMA - hanya data source yang berubah
      shipmentData.forEach((yearData: YearlyShipmentData) => {
        const year = yearData.year.toString();
        if (!yearlyTrend[year]) {
          yearlyTrend[year] = { on_time: 0, late: 0 };
        }

        yearData.historyShipments.forEach((shipment: HistoryShipment) => {
          // STRICT LOGIC tetap sama
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
            // Log skipped shipments for transparency
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

      // Convert to array format - TETAP SAMA
      const allYearlyTrend = Object.entries(yearlyTrend)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, values]) => ({ year, ...values }))
        .reverse();

      console.log(
        '📊 On-time vs late trend calculated with NEW ENDPOINT:',
        allYearlyTrend,
      );
      return allYearlyTrend;
    } catch (error) {
      console.error('Error in getAllOnTimeVsLateTrend:', error);
      throw error;
    }
  }

  /**
   * Get late delivery trend (only late deliveries) - CORRECTED STRICT LOGIC
   */
  async getLateTrend(industry_tenant_id?: number, supplier_tenant_id?: number) {
    const onTimeVsLateData = await this.getAllOnTimeVsLateTrend(
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
      '📊 Late trend calculated with CORRECTED STRICT logic:',
      top5LateTrend,
    );
    return top5LateTrend;
  }

  // ============================================================================
  // QUANTITY COMPLIANCE ANALYSIS - CORRECTED WITH STRICT LOGIC
  // ============================================================================

  /**
   * Analyze quantity compliance (target vs actual quantity) - CORRECTED STRICT LOGIC
   * Only analyzes shipments with status "Arrived" and complete quantity data
   */
  async getQuantityCompliance(
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const yearlyCompliance: {
      [key: string]: { compliant: number; noncompliant: number };
    } = {};

    try {
      let shipmentData: YearlyShipmentData[] = [];

      if (industry_tenant_id) {
        const industry_id = industry_tenant_id;
        // ✅ GANTI: Pakai endpoint AllYears
        const response =
          await srmContractIntegration.findAllHistoryShipmentByIndustryForAllYears(
            industry_id,
          );
        shipmentData = response.data.data || [];
      } else if (supplier_tenant_id) {
        const supplier_id =
          await this.resolveSupplierTenantId(supplier_tenant_id);
        if (!supplier_id) {
          throw new Error('Invalid supplier_tenant_id');
        }
        // ✅ GANTI: Pakai endpoint AllYears
        const response =
          await srmContractIntegration.findAllHistoryShipmentBySupplierForAllYears(
            supplier_id,
          );
        shipmentData = response.data.data || [];
      }

      // ✅ LOGIC TETAP SAMA - hanya data source yang berubah
      shipmentData.forEach((yearData: YearlyShipmentData) => {
        const year = yearData.year.toString();
        if (!yearlyCompliance[year]) {
          yearlyCompliance[year] = { compliant: 0, noncompliant: 0 };
        }

        yearData.historyShipments.forEach((shipment: HistoryShipment) => {
          // STRICT LOGIC tetap sama
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
            // Log skipped shipments for transparency
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

      // Convert to array format - TETAP SAMA
      const allYearlyCompliance = Object.entries(yearlyCompliance)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, values]) => ({ year, ...values }))
        .reverse();

      console.log(
        '📊 Quantity compliance calculated with NEW ENDPOINT:',
        allYearlyCompliance,
      );
      return allYearlyCompliance;
    } catch (error) {
      console.error('Error in getQuantityCompliance:', error);
      throw error;
    }
  }

  /**
   * Get non-compliant quantity trend - CORRECTED STRICT LOGIC
   */
  async getNonCompliantQuantity(
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const complianceData = await this.getQuantityCompliance(
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
      '📊 Non-compliant quantity trend calculated with CORRECTED STRICT logic:',
      top5NonCompliantQuantity,
    );
    return top5NonCompliantQuantity;
  }

  // ============================================================================
  // CONTRACT VOLUME ANALYSIS - CORRECTED WITH STRICT LOGIC
  // ============================================================================

  /**
   * Get total contract count by year - CORRECTED STRICT LOGIC
   * Uses contract-level counting (unique contracts per year)
   */
  async getContractTotal(
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const yearlyContracts: { [key: string]: Set<number> } = {};

    try {
      // ✅ GANTI: Gunakan interface yang sama seperti main service
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
        // ✅ GUNAKAN: allContract endpoint seperti main service
        const response =
          await srmContractIntegration.findAllContractByIndustryID(industry_id);
        allContractsData = response.data.data || [];
      } else if (supplier_tenant_id) {
        const supplier_id =
          await this.resolveSupplierTenantId(supplier_tenant_id);
        if (!supplier_id) {
          throw new Error('Invalid supplier_tenant_id');
        }
        // ✅ GUNAKAN: allContract endpoint seperti main service
        const response =
          await srmContractIntegration.findAllContractBySupplierID(supplier_id);
        allContractsData = response.data.data || [];
      }

      // ✅ LOGIC SAMA SEPERTI MAIN SERVICE: Count unique MASTER contracts per year
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

              // ✅ COUNT MASTER CONTRACT ID (bukan detail_contract_pkid)
              yearlyContracts[year].add(contract.pkid);
            }
          });
        });
      });

      // Convert to array format - TETAP SAMA
      const allYearlyTotal = Object.entries(yearlyContracts)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, contractSet]) => ({
          year,
          total: contractSet.size, // ✅ Count unique MASTER contracts
        }))
        .reverse();

      console.log(
        '📊 Contract total calculated with MASTER CONTRACT logic (same as main service):',
        allYearlyTotal,
      );
      return allYearlyTotal;
    } catch (error) {
      console.error('Error in getContractTotal:', error);
      throw error;
    }
  }

  // ============================================================================
  // SUMMARY METHODS (Risk Analysis) - CORRECTED WITH STRICT LOGIC
  // ============================================================================

  /**
   * Get late receipt summary - CORRECTED STRICT LOGIC
   */
  async getLateReceiptSummary(
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    const allYearlyTrend = await this.getAllOnTimeVsLateTrend(
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
      '📊 Late receipt summary calculated with CORRECTED STRICT logic:',
      summary,
    );
    return summary;
  }

  /**
   * Get quantity mismatch summary - CORRECTED STRICT LOGIC
   */
  async getQuantityMismatchSummary(
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    const complianceData = await this.getQuantityCompliance(
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
      '📊 Quantity mismatch summary calculated with CORRECTED STRICT logic:',
      summary,
    );
    return summary;
  }

  /**
   * Get contract decline summary - CORRECTED STRICT LOGIC
   */
  async getContractDeclineSummary(
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ): Promise<ContractDeclineSummary> {
    const contractData = await this.getContractTotal(
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
      console.log('📊 Contract decline summary (insufficient data):', summary);
      return summary;
    }

    const currentYearData = contractData[contractData.length - 1];
    const previousYearData = contractData[contractData.length - 2];

    const currentYearContracts = currentYearData.total;
    const previousYearContracts = previousYearData.total;
    const totalContracts = currentYearContracts + previousYearContracts;

    // Calculate growth/decline percentage
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
      '📊 Contract decline summary calculated with CORRECTED contract-level logic:',
      summary,
    );
    return summary;
  }

  // ============================================================================
  // RISK RATE TREND ANALYSIS - CORRECTED WITH STRICT LOGIC
  // ============================================================================

  /**
   * Get late receipt risk rate trend - CORRECTED STRICT LOGIC
   */
  async getLateReceiptRiskRateTrend(
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    const yearlyData = await this.getAllOnTimeVsLateTrend(
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
      '📊 Late receipt risk rate trend calculated with CORRECTED STRICT logic:',
      riskRateTrend,
    );
    return riskRateTrend;
  }

  /**
   * Get quantity mismatch risk rate trend - CORRECTED STRICT LOGIC
   */
  async getQuantityMismatchRiskRateTrend(
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    const yearlyData = await this.getQuantityCompliance(
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
      '📊 Quantity mismatch risk rate trend calculated with CORRECTED STRICT logic:',
      riskRateTrend,
    );
    return riskRateTrend;
  }

  /**
   * Get contract decline risk rate trend - CORRECTED STRICT LOGIC
   */
  async getContractDeclineRiskRateTrend(
    supplier_tenant_id?: number,
    industry_tenant_id?: number,
  ) {
    const yearlyData = await this.getContractTotal(
      industry_tenant_id,
      supplier_tenant_id,
    );

    // Convert to risk rate trend format
    const riskRateTrend = [];

    // Need at least 2 years of data to calculate decline
    if (yearlyData.length === 1) {
      // Hanya satu tahun data — tidak bisa hitung tren tapi kita return saja dengan nilai 0
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
        if (previousYear.total > 0 && currentYear.total < previousYear.total) {
          declineRate = parseFloat(
            (
              ((previousYear.total - currentYear.total) / previousYear.total) *
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
      '📊 Contract decline risk rate trend calculated with CORRECTED contract-level logic:',
      riskRateTrend,
    );
    return riskRateTrend;
  }

  // ============================================================================
  // ADDITIONAL ANALYTICS METHODS
  // ============================================================================

  /**
   * Get top suppliers for industry
   */
  async getTopSuppliers(
    industry_tenant_id: number,
  ): Promise<TopSupplierData[]> {
    const industry_id = industry_tenant_id;

    try {
      const response =
        await srmContractIntegration.findTopSuppliersByIndustryID(industry_id);
      const result = response.data.data || [];
      console.log('📊 Top suppliers retrieved:', result.length, 'suppliers');
      return result;
    } catch (error) {
      console.error('Error in getTopSuppliers:', error);
      throw error;
    }
  }

  /**
   * Get top industries for supplier
   */
  async getTopIndustries(
    supplier_tenant_id: number,
  ): Promise<TopIndustryData[]> {
    const supplier_id = await this.resolveSupplierTenantId(supplier_tenant_id);
    if (!supplier_id) {
      throw new Error('Invalid supplier_tenant_id');
    }

    try {
      const response =
        await srmContractIntegration.findTopIndustriesBySupplierID(supplier_id);
      const result = response.data.data || [];
      console.log('📊 Top industries retrieved:', result.length, 'industries');
      return result;
    } catch (error) {
      console.error('Error in getTopIndustries:', error);
      throw error;
    }
  }
}
