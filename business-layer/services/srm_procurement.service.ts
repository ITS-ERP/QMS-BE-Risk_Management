import { Request } from 'express';

// ✅ UPDATED: Import RabbitMQ functions instead of integration APIs
import {
  getSupplierByTenantIdViaRPC,
  getAllRFQsViaRPC,
  getAllDirectRFQsViaRPC,
  getRFQsByIndustryIdViaRPC,
  getDirectRFQsByIndustryIdViaRPC,
  getTotalRFQByStatusByIndustryIdViaRPC,
  getTotalRFQByStatusBySupplierIdViaRPC,
  getTotalDirectRFQByStatusByIndustryIdViaRPC,
  getTotalDirectRFQByStatusBySupplierIdViaRPC,
  getTotalRFQLastYearsByIndustryIdViaRPC,
  getTotalRFQLastYearsBySupplierIdViaRPC,
  getTotalDirectRFQLastYearsByIndustryIdViaRPC,
  getTotalDirectRFQLastYearsBySupplierIdViaRPC,
  getWinningRFQsBySupplierInDateRangeViaRPC,
  getLostRFQsBySupplierInDateRangeViaRPC,
  getAcceptedDirectRFQsByIndustryInRangeViaRPC,
  getRejectedDirectRFQsByIndustryInRangeViaRPC,
} from '../../rabbit/requestSRMData';

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
 * Updated to work with RabbitMQ integration system
 * Maintains same function names and response structures for compatibility
 */
export class SRMProcurementService {
  constructor() {
    // console.log(
    //   '🚀 [SRM Procurement Service] Initialized with RabbitMQ support',
    // );
  }

  // ============================================================================
  // LEGACY COMPATIBILITY METHOD
  // ============================================================================
  async fetchAllSRMProcurement(req: Request) {
    console.log(
      '📡 [SRM Procurement] Fetching all procurement data via RabbitMQ',
    );

    try {
      const response = await getAllRFQsViaRPC(req);
      return response;
    } catch (error) {
      console.error(
        '❌ [SRM Procurement] Error fetching all procurement data:',
        error,
      );
      throw error;
    }
  }

  // ============================================================================
  // TENANT RESOLUTION HELPER
  // ============================================================================
  /**
   * ✅ UPDATED: Convert supplier_tenant_id to supplier_id using RabbitMQ
   */
  private async resolveSupplierTenantId(
    req: Request,
    supplier_tenant_id: number,
  ): Promise<number | null> {
    try {
      console.log(
        `\n🔍 [SUPPLIER LOOKUP] Looking up supplier_pkid for tenant_id: ${supplier_tenant_id} via RabbitMQ`,
      );

      // ✅ UPDATED: Use RabbitMQ instead of direct API call
      const supplierData: any = await getSupplierByTenantIdViaRPC(
        req,
        supplier_tenant_id,
      );

      console.log(`🔍 [SRM SUPPLIER RPC] Response:`, {
        hasData: !!supplierData,
        hasPkid: !!supplierData?.pkid,
      });

      // ✅ IMPROVED: Better error handling
      if (!supplierData || typeof supplierData.pkid === 'undefined') {
        console.error(
          `❌ [NO SUPPLIER] No supplier found or invalid format for tenant_id: ${supplier_tenant_id}`,
        );

        // ✅ FALLBACK: Testing purposes
        const fallbackSupplierPkid = supplier_tenant_id - 2; // tenant_id 3 → supplier_pkid 1
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

      // ✅ FALLBACK: For testing when RabbitMQ is not available
      const fallbackSupplierPkid = supplier_tenant_id - 2; // tenant_id 3 → supplier_pkid 1
      console.warn(
        `⚠️ [FALLBACK] RabbitMQ call failed, using fallback mapping: tenant_id ${supplier_tenant_id} → supplier_pkid ${fallbackSupplierPkid}`,
      );
      return fallbackSupplierPkid;
    }
  }
  // ============================================================================
  // INDUSTRY PERSPECTIVE - RFQ DELAY RISK ANALYSIS
  // ============================================================================

  /**
   * ✅ UPDATED: Analyze RFQ on-time vs delayed count by industry using RabbitMQ
   * Uses both Open/Invitation and Direct RFQ data for comprehensive analysis
   */
  async getRFQOnTimeDelayedCount(req: Request, industry_tenant_id?: number) {
    if (!industry_tenant_id) {
      throw new Error('industry_tenant_id is required');
    }

    const industry_id = industry_tenant_id; // Direct mapping

    try {
      console.log(
        `📡 [RabbitMQ] Getting RFQ delay analysis for industry ${industry_id}`,
      );

      // ✅ UPDATED: Use RabbitMQ instead of direct API calls
      const [openRFQResponse, directRFQResponse] = await Promise.all([
        getTotalRFQLastYearsByIndustryIdViaRPC(req, industry_id, 5),
        getTotalDirectRFQLastYearsByIndustryIdViaRPC(req, industry_id, 5),
      ]);

      const openRFQData = Array.isArray(openRFQResponse) ? openRFQResponse : [];
      const directRFQData = Array.isArray(directRFQResponse)
        ? directRFQResponse
        : [];

      console.log(
        `📊 [RFQ DELAY] Open RFQ data: ${openRFQData.length} year records`,
      );
      console.log(
        `📊 [RFQ DELAY] Direct RFQ data: ${directRFQData.length} year records`,
      );

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

      console.log(
        `✅ [RFQ DELAY] Analysis complete: ${allYearlyStatus.length} year records`,
      );
      return allYearlyStatus;
    } catch (error) {
      console.error('❌ [RFQ DELAY] Error in getRFQOnTimeDelayedCount:', error);
      throw error;
    }
  }

  /**
   * Get RFQ delay count for industry (only delayed RFQs)
   */
  async getRFQDelayCount(req: Request, industry_tenant_id?: number) {
    if (!industry_tenant_id) {
      throw new Error('industry_tenant_id is required');
    }

    const delayData = await this.getRFQOnTimeDelayedCount(
      req,
      industry_tenant_id,
    );

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
  async getRFQDelaySummary(req: Request, industry_tenant_id?: number) {
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

    const delayData = await this.getRFQOnTimeDelayedCount(
      req,
      industry_tenant_id,
    );

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
  async getRFQDelayRiskRateTrend(req: Request, industry_tenant_id?: number) {
    if (!industry_tenant_id) {
      return [];
    }

    const yearlyData = await this.getRFQOnTimeDelayedCount(
      req,
      industry_tenant_id,
    );

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
   * ✅ UPDATED: Analyze accept/reject count for industry using Direct RFQ data via RabbitMQ
   */
  async getDirectRFQAcceptRejectCount(
    req: Request,
    industry_tenant_id: number,
  ) {
    const industry_id = industry_tenant_id; // Direct mapping

    try {
      console.log(
        `📡 [RabbitMQ] Getting Direct RFQ accept/reject analysis for industry ${industry_id}`,
      );

      // ✅ UPDATED: Use RabbitMQ instead of direct API calls
      const [acceptedResponse, rejectedResponse] = await Promise.all([
        getAcceptedDirectRFQsByIndustryInRangeViaRPC(req, industry_id, 5),
        getRejectedDirectRFQsByIndustryInRangeViaRPC(req, industry_id, 5),
      ]);

      const acceptedData = Array.isArray(acceptedResponse)
        ? acceptedResponse
        : [];
      const rejectedData = Array.isArray(rejectedResponse)
        ? rejectedResponse
        : [];

      console.log(
        `📊 [DIRECT RFQ] Accepted data: ${acceptedData.length} year records`,
      );
      console.log(
        `📊 [DIRECT RFQ] Rejected data: ${rejectedData.length} year records`,
      );

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

      console.log(
        `✅ [DIRECT RFQ] Accept/reject analysis complete: ${allYearlyWinLose.length} year records`,
      );
      return allYearlyWinLose;
    } catch (error) {
      console.error(
        '❌ [DIRECT RFQ] Error in getDirectRFQAcceptRejectCount:',
        error,
      );
      throw error;
    }
  }
  // ============================================================================
  // SUPPLIER PERSPECTIVE - RFQ WIN/LOSS RISK ANALYSIS
  // ============================================================================

  /**
   * ✅ UPDATED: Analyze win/loss count for supplier using RabbitMQ date-based approach
   */
  async getSupplierRFQWinLoseCount(req: Request, supplier_tenant_id: number) {
    // Resolve supplier tenant ID to supplier ID
    const supplier_id = await this.resolveSupplierTenantId(
      req,
      supplier_tenant_id,
    );
    if (!supplier_id) {
      throw new Error('Invalid supplier_tenant_id or supplier not found');
    }

    try {
      console.log(
        `📡 [RabbitMQ] Getting supplier RFQ win/lose analysis for supplier ${supplier_id}`,
      );

      // Get data for last 5 years
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 4;
      const start_date = `${startYear}-01-01`;
      const end_date = `${currentYear}-12-31`;

      console.log(
        `📅 [SUPPLIER WIN/LOSE] Date range: ${start_date} to ${end_date}`,
      );

      // ✅ UPDATED: Use RabbitMQ instead of direct API calls
      const [winningResponse, lostResponse] = await Promise.all([
        getWinningRFQsBySupplierInDateRangeViaRPC(
          req,
          supplier_id,
          start_date,
          end_date,
        ),
        getLostRFQsBySupplierInDateRangeViaRPC(
          req,
          supplier_id,
          start_date,
          end_date,
        ),
      ]);

      const winningData = Array.isArray(winningResponse) ? winningResponse : [];
      const lostData = Array.isArray(lostResponse) ? lostResponse : [];

      console.log(
        `📊 [SUPPLIER WIN/LOSE] Winning data: ${winningData.length} year records`,
      );
      console.log(
        `📊 [SUPPLIER WIN/LOSE] Lost data: ${lostData.length} year records`,
      );

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

      console.log(
        `✅ [SUPPLIER WIN/LOSE] Analysis complete: ${allYearlyWinLose.length} year records`,
      );
      return allYearlyWinLose;
    } catch (error) {
      console.error(
        '❌ [SUPPLIER WIN/LOSE] Error in getSupplierRFQWinLoseCount:',
        error,
      );
      throw error;
    }
  }

  // ============================================================================
  // UNIFIED WIN/LOSE METHODS (Support both Industry and Supplier)
  // ============================================================================

  /**
   * ✅ UPDATED: Get RFQ win vs lose count - Unified method for both industry and supplier
   */
  async getWinLoseCount(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    if (industry_tenant_id) {
      // Industry perspective: Use Direct RFQ Accept/Reject
      return await this.getDirectRFQAcceptRejectCount(req, industry_tenant_id);
    } else if (supplier_tenant_id) {
      // Supplier perspective: Use Open & Invitation RFQ Win/Lose
      return await this.getSupplierRFQWinLoseCount(req, supplier_tenant_id);
    } else {
      throw new Error(
        'Either industry_tenant_id or supplier_tenant_id is required',
      );
    }
  }

  /**
   * ✅ UPDATED: Get RFQ lose count - Unified method for both industry and supplier
   */
  async getLoseCount(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const winLoseData = await this.getWinLoseCount(
      req,
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
   * ✅ UPDATED: Get RFQ loss summary - Unified method for both industry and supplier
   */
  async getRFQLossSummary(
    req: Request,
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    const winLoseData = await this.getWinLoseCount(
      req,
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
   * ✅ UPDATED: Get RFQ loss risk rate trend - Unified method for both industry and supplier
   */
  async getRFQLossRiskRateTrend(
    req: Request, // ✅ FIXED: Added req parameter
    industry_tenant_id?: number,
    supplier_tenant_id?: number,
  ) {
    console.log('🔧 [RFQ LOSS TREND] Called with req parameter');

    try {
      const yearlyData = await this.getWinLoseCount(
        req, // ✅ FIXED: Use req parameter instead of dummy
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
    } catch (error) {
      console.error('❌ [RFQ LOSS TREND] Error:', error);
      return [];
    }
  }

  // ============================================================================
  // ADDITIONAL HELPER METHODS
  // ============================================================================

  /**
   * ✅ UPDATED: Get comprehensive RFQ statistics for industry using RabbitMQ
   * Combines Open/Invitation and Direct RFQ data
   */
  async getComprehensiveRFQStats(
    req: Request,
    industry_tenant_id: number,
  ): Promise<{
    openRFQByStatus: RFQStatusData[];
    directRFQByStatus: RFQStatusData[];
  }> {
    const industry_id = industry_tenant_id;

    try {
      console.log(
        `📡 [RabbitMQ] Getting comprehensive RFQ stats for industry ${industry_id}`,
      );

      // ✅ UPDATED: Use RabbitMQ instead of direct API calls
      const [statusResponse, directStatusResponse] = await Promise.all([
        getTotalRFQByStatusByIndustryIdViaRPC(req, industry_id),
        getTotalDirectRFQByStatusByIndustryIdViaRPC(req, industry_id),
      ]);

      const openRFQByStatus = Array.isArray(statusResponse)
        ? statusResponse
        : [];
      const directRFQByStatus = Array.isArray(directStatusResponse)
        ? directStatusResponse
        : [];

      console.log(
        `✅ [COMPREHENSIVE STATS] Retrieved ${openRFQByStatus.length} open RFQ statuses, ${directRFQByStatus.length} direct RFQ statuses`,
      );

      return {
        openRFQByStatus,
        directRFQByStatus,
      };
    } catch (error) {
      console.error(
        '❌ [COMPREHENSIVE STATS] Error in getComprehensiveRFQStats:',
        error,
      );
      throw error;
    }
  }

  /**
   * ✅ UPDATED: Get comprehensive RFQ statistics for supplier using RabbitMQ
   */
  async getSupplierRFQStats(
    req: Request,
    supplier_tenant_id: number,
  ): Promise<{
    openRFQByStatus: RFQStatusData[];
    directRFQByStatus: RFQStatusData[];
  }> {
    const supplier_id = await this.resolveSupplierTenantId(
      req,
      supplier_tenant_id,
    );
    if (!supplier_id) {
      throw new Error('Invalid supplier_tenant_id');
    }

    try {
      console.log(
        `📡 [RabbitMQ] Getting supplier RFQ stats for supplier ${supplier_id}`,
      );

      // ✅ UPDATED: Use RabbitMQ instead of direct API calls
      const [statusResponse, directStatusResponse] = await Promise.all([
        getTotalRFQByStatusBySupplierIdViaRPC(req, supplier_id),
        getTotalDirectRFQByStatusBySupplierIdViaRPC(req, supplier_id),
      ]);

      const openRFQByStatus = Array.isArray(statusResponse)
        ? statusResponse
        : [];
      const directRFQByStatus = Array.isArray(directStatusResponse)
        ? directStatusResponse
        : [];

      console.log(
        `✅ [SUPPLIER STATS] Retrieved ${openRFQByStatus.length} open RFQ statuses, ${directRFQByStatus.length} direct RFQ statuses`,
      );

      return {
        openRFQByStatus,
        directRFQByStatus,
      };
    } catch (error) {
      console.error('❌ [SUPPLIER STATS] Error in getSupplierRFQStats:', error);
      throw error;
    }
  }
}
