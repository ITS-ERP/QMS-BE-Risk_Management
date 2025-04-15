import * as crmRequisitionIntegration from '../../data-access/integrations/crm_requisition.integration';

export class CRMRequisitionService {
  async fetchAllCRMLoR() {
    const response = await crmRequisitionIntegration.getAllCRMLoR();
    return response.data.data;
  }

  async fetchAllCRMLoA() {
    const response = await crmRequisitionIntegration.getAllCRMLoA();
    return response.data.data;
  }

  async getAllLoRAcceptReject(industry_code?: string, retail_code?: string) {
    const data = await this.fetchAllCRMLoR();

    const yearlyAcceptReject: {
      [key: string]: { accepted: number; rejected: number };
    } = {};
    const filteredYears: Set<string> = new Set();

    data.forEach(
      (item: {
        due_date: string;
        industry_code: string;
        retail_code: string;
        status: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const yearKey = new Date(item.due_date).getFullYear().toString();
        filteredYears.add(yearKey);

        if (!yearlyAcceptReject[yearKey]) {
          yearlyAcceptReject[yearKey] = { accepted: 0, rejected: 0 };
        }

        if (item.status === 'accepted') {
          yearlyAcceptReject[yearKey].accepted += 1;
        } else if (item.status === 'rejected') {
          yearlyAcceptReject[yearKey].rejected += 1;
        }
      },
    );

    const allYearlyAcceptReject = Array.from(filteredYears)
      .map((year) => ({
        year,
        accepted: yearlyAcceptReject[year]?.accepted || 0,
        rejected: yearlyAcceptReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    return allYearlyAcceptReject;
  }

  async getLoRReject(industry_code?: string, retail_code?: string) {
    const data = await this.fetchAllCRMLoR();

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const filteredYears: Set<string> = new Set();
    data.forEach(
      (item: {
        due_date: string;
        industry_code: string;
        retail_code: string;
        status: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const yearKey = new Date(item.due_date).getFullYear().toString();
        filteredYears.add(yearKey);

        if (item.status === 'rejected') {
          if (!yearlyReject[yearKey]) {
            yearlyReject[yearKey] = { rejected: 0 };
          }
          yearlyReject[yearKey].rejected += 1;
        }
      },
    );

    filteredYears.forEach((year) => {
      if (!yearlyReject[year]) {
        yearlyReject[year] = { rejected: 0 };
      }
    });

    const allYearlyReject = Array.from(filteredYears)
      .map((year) => ({
        year,
        rejected: yearlyReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year)) // Ascending sort by year
      .slice(0, 5);

    return allYearlyReject;
  }

  async getAllLoAAcceptReject(industry_code?: string, retail_code?: string) {
    const data = await this.fetchAllCRMLoA();

    const yearlyAcceptReject: {
      [key: string]: { accepted: number; rejected: number };
    } = {};
    const filteredYears: Set<string> = new Set();

    data.forEach(
      (item: {
        due_date: string;
        industry_code: string;
        retail_code: string;
        status: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const yearKey = new Date(item.due_date).getFullYear().toString();
        filteredYears.add(yearKey);

        if (!yearlyAcceptReject[yearKey]) {
          yearlyAcceptReject[yearKey] = { accepted: 0, rejected: 0 };
        }

        if (item.status === 'accepted') {
          yearlyAcceptReject[yearKey].accepted += 1;
        } else if (item.status === 'rejected') {
          yearlyAcceptReject[yearKey].rejected += 1;
        }
      },
    );

    const allYearlyAcceptReject = Array.from(filteredYears)
      .map((year) => ({
        year,
        accepted: yearlyAcceptReject[year]?.accepted || 0,
        rejected: yearlyAcceptReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    return allYearlyAcceptReject;
  }

  async getLoAReject(industry_code?: string, retail_code?: string) {
    const data = await this.fetchAllCRMLoA();

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const filteredYears: Set<string> = new Set();

    data.forEach(
      (item: {
        due_date: string;
        industry_code: string;
        retail_code: string;
        status: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const yearKey = new Date(item.due_date).getFullYear().toString();
        filteredYears.add(yearKey);

        if (item.status === 'rejected') {
          if (!yearlyReject[yearKey]) {
            yearlyReject[yearKey] = { rejected: 0 };
          }
          yearlyReject[yearKey].rejected += 1;
        }
      },
    );

    filteredYears.forEach((year) => {
      if (!yearlyReject[year]) {
        yearlyReject[year] = { rejected: 0 };
      }
    });

    const allYearlyReject = Array.from(filteredYears)
      .map((year) => ({
        year,
        rejected: yearlyReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year)) // Ascending sort by year
      .slice(0, 5);

    return allYearlyReject;
  }

  //INDUSTRY
  // 1. Penolakan LoR
  // 2. Penolakan LoA

  //RETAIL
  // 1. Penolakan LoR
  // 2. Penolakan LoA

  async getLoRRejectionSummary(retail_code?: string, industry_code?: string) {
    const lorData = await this.getAllLoRAcceptReject(
      industry_code,
      retail_code,
    );

    let totalAccepted = 0;
    let totalRejected = 0;

    lorData.forEach((item) => {
      totalAccepted += item.accepted;
      totalRejected += item.rejected;
    });

    const totalLoR = totalAccepted + totalRejected;

    return {
      total_lor: totalLoR > 0 ? totalLoR : 0,
      accepted_lor: totalAccepted > 0 ? totalAccepted : 0,
      rejected_lor: totalRejected > 0 ? totalRejected : 0,
      acceptance_rate:
        totalLoR > 0
          ? parseFloat(((totalAccepted / totalLoR) * 100).toFixed(2))
          : 0.0,
      rejection_rate:
        totalLoR > 0
          ? parseFloat(((totalRejected / totalLoR) * 100).toFixed(2))
          : 0.0,
    };
  }

  // Summary untuk Penolakan LoA
  async getLoARejectionSummary(retail_code?: string, industry_code?: string) {
    const loaData = await this.getAllLoAAcceptReject(
      industry_code,
      retail_code,
    );

    let totalAccepted = 0;
    let totalRejected = 0;

    loaData.forEach((item) => {
      totalAccepted += item.accepted;
      totalRejected += item.rejected;
    });

    const totalLoA = totalAccepted + totalRejected;

    return {
      total_loa: totalLoA > 0 ? totalLoA : 0,
      accepted_loa: totalAccepted > 0 ? totalAccepted : 0,
      rejected_loa: totalRejected > 0 ? totalRejected : 0,
      acceptance_rate:
        totalLoA > 0
          ? parseFloat(((totalAccepted / totalLoA) * 100).toFixed(2))
          : 0.0,
      rejection_rate:
        totalLoA > 0
          ? parseFloat(((totalRejected / totalLoA) * 100).toFixed(2))
          : 0.0,
    };
  }

  // Risk Rate Trend untuk Penolakan LoR
  async getLoRRejectionRiskRateTrend(
    retail_code?: string,
    industry_code?: string,
  ) {
    const yearlyData = await this.getAllLoRAcceptReject(
      industry_code,
      retail_code,
    );

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.accepted + item.rejected;
      const riskRate =
        total > 0 ? parseFloat(((item.rejected / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }

  // Risk Rate Trend untuk Penolakan LoA
  async getLoARejectionRiskRateTrend(
    retail_code?: string,
    industry_code?: string,
  ) {
    const yearlyData = await this.getAllLoAAcceptReject(
      industry_code,
      retail_code,
    );

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.accepted + item.rejected;
      const riskRate =
        total > 0 ? parseFloat(((item.rejected / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }
}
