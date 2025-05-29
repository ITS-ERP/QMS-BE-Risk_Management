import * as srmProcurementIntegration from '../../data-access/integrations/srm_procurement.integration';
import * as srmSupplierPortalIntegration from '../../data-access/integrations/srm_supplier_portal.integration';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RFQItem {
  pkid: number;
  registration_start_date: string;
  rfq_end_date: string;
  status?: string;
}

interface DirectRFQItem {
  pkid: number;
  registration_start_date: string;
  rfq_end_date: string;
  status?: string;
}

interface YearlyRFQData {
  year: number;
  total: number;
  rfqs?: RFQItem[];
  directRFQs?: DirectRFQItem[];
}

interface YearlyWinLossData {
  year: number;
  total: number;
  rfqs?: RFQItem[];
}

interface YearlyAcceptRejectData {
  year: number;
  total: number;
  directRFQs?: DirectRFQItem[];
}

interface RFQStatusData {
  status: string;
  total: number;
}

interface SupplierData {
  pkid: number;
  name?: string;
}

/**
 * SRM Procurement Service for Risk Management
 * Updated to work with new SRM integration system
 * Maintains same function names and response structures for compatibility
 */
export class SRMProcurementService {
  // ============================================================================
  // LEGACY COMPATIBILITY METHOD
  // ============================================================================
  async fetchAllSRMProcurement() {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
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

  // ============================================================================
  // INDUSTRY PERSPECTIVE - RFQ DELAY RISK ANALYSIS
  // ============================================================================

  /**
   * Analyze RFQ on-time vs delayed count by industry
   * Uses both Open/Invitation and Direct RFQ data for comprehensive analysis
   */
  async getRFQOnTimeDelayedCount(industry_tenant_id?: number) {
    if (!industry_tenant_id) {
      throw new Error('industry_tenant_id is required');
    }

    const industry_id = industry_tenant_id; // Direct mapping

    try {
      // Get last 5 years of RFQ data for trend analysis
      const [openRFQResponse, directRFQResponse] = await Promise.all([
        srmProcurementIntegration.findTotalRFQForLastYearsByIndustryID(
          industry_id,
          5,
        ),
        srmProcurementIntegration.findTotalDirectRFQForLastYearsByIndustryID(
          industry_id,
          5,
        ),
      ]);

      const openRFQData = openRFQResponse.data.data || [];
      const directRFQData = directRFQResponse.data.data || [];

      // Dictionary untuk menyimpan data per tahun
      const yearlyData: { [key: string]: { ontime: number; delayed: number } } =
        {};

      // Process Open & Invitation RFQ data
      openRFQData.forEach((yearData: YearlyRFQData) => {
        const year = yearData.year.toString();
        if (!yearlyData[year]) {
          yearlyData[year] = { ontime: 0, delayed: 0 };
        }

        yearData.rfqs?.forEach((rfq: RFQItem) => {
          if (rfq.registration_start_date && rfq.rfq_end_date) {
            const startDate = new Date(rfq.registration_start_date);
            const endDate = new Date(rfq.rfq_end_date);

            // Calculate difference in days
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If less than 30 days, consider on-time, otherwise delayed
            if (diffDays < 30) {
              yearlyData[year].ontime += 1;
            } else {
              yearlyData[year].delayed += 1;
            }
          }
        });
      });

      // Process Direct RFQ data
      directRFQData.forEach((yearData: YearlyRFQData) => {
        const year = yearData.year.toString();
        if (!yearlyData[year]) {
          yearlyData[year] = { ontime: 0, delayed: 0 };
        }

        yearData.directRFQs?.forEach((rfq: DirectRFQItem) => {
          if (rfq.registration_start_date && rfq.rfq_end_date) {
            const startDate = new Date(rfq.registration_start_date);
            const endDate = new Date(rfq.rfq_end_date);

            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 30) {
              yearlyData[year].ontime += 1;
            } else {
              yearlyData[year].delayed += 1;
            }
          }
        });
      });

      // Convert to array format and sort by year
      const allYearlyStatus = Object.entries(yearlyData)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, values]) => ({ year, ...values }))
        .reverse();

      return allYearlyStatus;
    } catch (error) {
      console.error('Error in getRFQOnTimeDelayedCount:', error);
      throw error;
    }
  }

  /**
   * Get RFQ delay count for industry (only delayed RFQs)
   */
  async getRFQDelayCount(industry_tenant_id?: number) {
    if (!industry_tenant_id) {
      throw new Error('industry_tenant_id is required');
    }

    const delayData = await this.getRFQOnTimeDelayedCount(industry_tenant_id);

    // Extract only delayed count from the comprehensive data
    const allYearlyDelayCount = delayData
      .map((item) => ({
        year: item.year,
        delay: item.delayed,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();

    return allYearlyDelayCount;
  }

  /**
   * Get RFQ delay summary for industry
   */
  async getRFQDelaySummary(industry_tenant_id?: number) {
    if (!industry_tenant_id) {
      // Return default values if no industry specified
      return {
        total_rfq: 0,
        delayed_rfq: 0,
        on_time_rfq: 0,
        on_time_rate: 0.0,
        delay_rate: 0.0,
      };
    }

    const delayData = await this.getRFQOnTimeDelayedCount(industry_tenant_id);

    // Calculate totals from all years
    let totalOntime = 0;
    let totalDelayed = 0;

    delayData.forEach((item) => {
      totalOntime += item.ontime;
      totalDelayed += item.delayed;
    });

    const totalRFQ = totalOntime + totalDelayed;

    return {
      total_rfq: totalRFQ,
      delayed_rfq: totalDelayed,
      on_time_rfq: totalOntime,
      on_time_rate:
        totalRFQ > 0
          ? parseFloat(((totalOntime / totalRFQ) * 100).toFixed(2))
          : 0.0,
      delay_rate:
        totalRFQ > 0
          ? parseFloat(((totalDelayed / totalRFQ) * 100).toFixed(2))
          : 0.0,
    };
  }

  /**
   * Get RFQ delay risk rate trend for industry
   */
  async getRFQDelayRiskRateTrend(industry_tenant_id?: number) {
    if (!industry_tenant_id) {
      return [];
    }

    const yearlyData = await this.getRFQOnTimeDelayedCount(industry_tenant_id);

    // Transform data to risk rate trend format
    const riskRateTrend = yearlyData.map((item) => {
      const total = item.ontime + item.delayed;
      const delayRate =
        total > 0 ? parseFloat(((item.delayed / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: delayRate,
      };
    });

    return riskRateTrend;
  }

  // ============================================================================
  // INDUSTRY PERSPECTIVE - DIRECT RFQ ACCEPT/REJECT ANALYSIS
  // ============================================================================

  /**
   * Analyze accept/reject count for industry using Direct RFQ data
   */
  async getDirectRFQAcceptRejectCount(industry_tenant_id: number) {
    const industry_id = industry_tenant_id; // Direct mapping

    try {
      // Get data for last 5 years
      const [acceptedResponse, rejectedResponse] = await Promise.all([
        srmProcurementIntegration.findAcceptedDirectRFQsByIndustryIDinRange(
          industry_id,
          5,
        ),
        srmProcurementIntegration.findRejectedDirectRFQsByIndustryIDinRange(
          industry_id,
          5,
        ),
      ]);

      const acceptedData = acceptedResponse.data.data || [];
      const rejectedData = rejectedResponse.data.data || [];

      const yearlyAcceptReject: {
        [key: string]: { accept: number; reject: number };
      } = {};

      // Process accepted data
      acceptedData.forEach((yearData: YearlyAcceptRejectData) => {
        const year = yearData.year.toString();
        if (!yearlyAcceptReject[year]) {
          yearlyAcceptReject[year] = { accept: 0, reject: 0 };
        }
        yearlyAcceptReject[year].accept = yearData.total || 0;
      });

      // Process rejected data
      rejectedData.forEach((yearData: YearlyAcceptRejectData) => {
        const year = yearData.year.toString();
        if (!yearlyAcceptReject[year]) {
          yearlyAcceptReject[year] = { accept: 0, reject: 0 };
        }
        yearlyAcceptReject[year].reject = yearData.total || 0;
      });

      // Convert to array format (with win/lose naming for compatibility)
      const allYearlyWinLose = Object.entries(yearlyAcceptReject)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, values]) => ({
          year,
          win: values.accept, // accept = win for industry
          lose: values.reject, // reject = lose for industry
        }))
        .reverse();

      return allYearlyWinLose;
    } catch (error) {
      console.error('Error in getDirectRFQAcceptRejectCount:', error);
      throw error;
    }
  }

  // ============================================================================
  // SUPPLIER PERSPECTIVE - RFQ WIN/LOSS RISK ANALYSIS
  // ============================================================================

  /**
   * Analyze win/loss count for supplier using new date-based approach
   */
  async getSupplierRFQWinLoseCount(supplier_tenant_id: number) {
    // Resolve supplier tenant ID to supplier ID
    const supplier_id = await this.resolveSupplierTenantId(supplier_tenant_id);
    if (!supplier_id) {
      throw new Error('Invalid supplier_tenant_id or supplier not found');
    }

    try {
      // Get data for last 5 years
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 4;
      const start_date = `${startYear}-01-01`;
      const end_date = `${currentYear}-12-31`;

      const [winningResponse, lostResponse] = await Promise.all([
        srmProcurementIntegration.findWinningRFQsBySupplierInDateRange(
          supplier_id,
          start_date,
          end_date,
        ),
        srmProcurementIntegration.findLostRFQsBySupplierInDateRange(
          supplier_id,
          start_date,
          end_date,
        ),
      ]);

      const winningData = winningResponse.data.data || [];
      const lostData = lostResponse.data.data || [];

      const yearlyWinLose: { [key: string]: { win: number; lose: number } } =
        {};

      // Process winning data
      winningData.forEach((yearData: YearlyWinLossData) => {
        const year = yearData.year.toString();
        if (!yearlyWinLose[year]) {
          yearlyWinLose[year] = { win: 0, lose: 0 };
        }
        yearlyWinLose[year].win = yearData.total || 0;
      });

      // Process lost data
      lostData.forEach((yearData: YearlyWinLossData) => {
        const year = yearData.year.toString();
        if (!yearlyWinLose[year]) {
          yearlyWinLose[year] = { win: 0, lose: 0 };
        }
        yearlyWinLose[year].lose = yearData.total || 0;
      });

      // Convert to array format
      const allYearlyWinLose = Object.entries(yearlyWinLose)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, values]) => ({ year, ...values }))
        .reverse();

      return allYearlyWinLose;
    } catch (error) {
      console.error('Error in getSupplierRFQWinLoseCount:', error);
      throw error;
    }
  }

  // ============================================================================
  // UNIFIED WIN/LOSE METHODS (Support both Industry and Supplier)
  // ============================================================================

  /**
   * Get RFQ win vs lose count - Unified method for both industry and supplier
   */
  async getWinLoseCount(
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    if (industry_tenant_id) {
      // Industry perspective: Use Direct RFQ Accept/Reject
      return await this.getDirectRFQAcceptRejectCount(industry_tenant_id);
    } else if (supplier_tenant_id) {
      // Supplier perspective: Use Open & Invitation RFQ Win/Lose
      return await this.getSupplierRFQWinLoseCount(supplier_tenant_id);
    } else {
      throw new Error(
        'Either industry_tenant_id or supplier_tenant_id is required',
      );
    }
  }

  /**
   * Get RFQ lose count - Unified method for both industry and supplier
   */
  async getLoseCount(industry_tenant_id?: number, supplier_tenant_id?: number) {
    const winLoseData = await this.getWinLoseCount(
      industry_tenant_id,
      supplier_tenant_id,
    );

    // Extract only lose count
    const allYearlyLoseCount = winLoseData
      .map((item) => ({
        year: item.year,
        lose: item.lose,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();

    return allYearlyLoseCount;
  }

  /**
   * Get RFQ loss summary - Unified method for both industry and supplier
   */
  async getRFQLossSummary(
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const winLoseData = await this.getWinLoseCount(
      industry_tenant_id,
      supplier_tenant_id,
    );

    let totalWin = 0;
    let totalLose = 0;

    winLoseData.forEach((item) => {
      totalWin += item.win;
      totalLose += item.lose;
    });

    const totalRFQ = totalWin + totalLose;

    return {
      total_rfq: totalRFQ > 0 ? totalRFQ : 0,
      won_rfq: totalWin > 0 ? totalWin : 0,
      lost_rfq: totalLose > 0 ? totalLose : 0,
      win_rate:
        totalRFQ > 0
          ? parseFloat(((totalWin / totalRFQ) * 100).toFixed(2))
          : 0.0,
      loss_rate:
        totalRFQ > 0
          ? parseFloat(((totalLose / totalRFQ) * 100).toFixed(2))
          : 0.0,
    };
  }

  /**
   * Get RFQ loss risk rate trend - Unified method for both industry and supplier
   */
  async getRFQLossRiskRateTrend(
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const yearlyData = await this.getWinLoseCount(
      industry_tenant_id,
      supplier_tenant_id,
    );

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.win + item.lose;
      const riskRate =
        total > 0 ? parseFloat(((item.lose / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }

  // ============================================================================
  // ADDITIONAL HELPER METHODS
  // ============================================================================

  /**
   * Get comprehensive RFQ statistics for industry
   * Combines Open/Invitation and Direct RFQ data
   */
  async getComprehensiveRFQStats(industry_tenant_id: number): Promise<{
    openRFQByStatus: RFQStatusData[];
    directRFQByStatus: RFQStatusData[];
  }> {
    const industry_id = industry_tenant_id;

    try {
      const [statusResponse, directStatusResponse] = await Promise.all([
        srmProcurementIntegration.findTotalRFQByStatusByIndustryID(industry_id),
        srmProcurementIntegration.findTotalDirectRFQByStatusAndIndustryID(
          industry_id,
        ),
      ]);

      return {
        openRFQByStatus: statusResponse.data.data || [],
        directRFQByStatus: directStatusResponse.data.data || [],
      };
    } catch (error) {
      console.error('Error in getComprehensiveRFQStats:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive RFQ statistics for supplier
   */
  async getSupplierRFQStats(supplier_tenant_id: number): Promise<{
    openRFQByStatus: RFQStatusData[];
    directRFQByStatus: RFQStatusData[];
  }> {
    const supplier_id = await this.resolveSupplierTenantId(supplier_tenant_id);
    if (!supplier_id) {
      throw new Error('Invalid supplier_tenant_id');
    }

    try {
      const [statusResponse, directStatusResponse] = await Promise.all([
        srmProcurementIntegration.findTotalRFQByStatusBySupplierID(supplier_id),
        srmProcurementIntegration.findTotalDirectRFQByStatusAndSupplierID(
          supplier_id,
        ),
      ]);

      return {
        openRFQByStatus: statusResponse.data.data || [],
        directRFQByStatus: directStatusResponse.data.data || [],
      };
    } catch (error) {
      console.error('Error in getSupplierRFQStats:', error);
      throw error;
    }
  }
}
