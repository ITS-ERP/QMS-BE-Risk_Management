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
    const allYears: Set<string> = new Set();

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
        allYears.add(yearKey);

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

    const allYearlyAcceptReject = Array.from(allYears)
      .map((year) => ({
        year,
        accepted: yearlyAcceptReject[year]?.accepted || 0,
        rejected: yearlyAcceptReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .reverse();

    return allYearlyAcceptReject;
  }

  async getLoRReject(industry_code?: string, retail_code?: string) {
    const data = await this.fetchAllCRMLoR();

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const allYears: Set<string> = new Set();

    data.forEach(
      (item: {
        due_date: string;
        industry_code: string;
        retail_code: string;
        status: string;
      }) => {
        const yearKey = new Date(item.due_date).getFullYear().toString();
        allYears.add(yearKey);

        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code) ||
          item.status !== 'rejected'
        ) {
          return;
        }

        if (!yearlyReject[yearKey]) {
          yearlyReject[yearKey] = { rejected: 0 };
        }

        yearlyReject[yearKey].rejected += 1;
      },
    );

    // Tambahkan tahun-tahun yang tidak ada data rejected-nya
    allYears.forEach((year) => {
      if (!yearlyReject[year]) {
        yearlyReject[year] = { rejected: 0 };
      }
    });

    const allYearlyReject = Array.from(allYears)
      .map((year) => ({
        year,
        rejected: yearlyReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .reverse()
      .slice(0, 5);

    return allYearlyReject;
  }

  async getAllLoAAcceptReject(industry_code?: string, retail_code?: string) {
    const data = await this.fetchAllCRMLoA();

    const yearlyAcceptReject: {
      [key: string]: { accepted: number; rejected: number };
    } = {};
    const allYears: Set<string> = new Set();

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
        allYears.add(yearKey);

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

    const allYearlyAcceptReject = Array.from(allYears)
      .map((year) => ({
        year,
        accepted: yearlyAcceptReject[year]?.accepted || 0,
        rejected: yearlyAcceptReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .reverse();

    return allYearlyAcceptReject;
  }

  async getLoAReject(industry_code?: string, retail_code?: string) {
    const data = await this.fetchAllCRMLoA();

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const allYears: Set<string> = new Set();

    data.forEach(
      (item: {
        due_date: string;
        industry_code: string;
        retail_code: string;
        status: string;
      }) => {
        const yearKey = new Date(item.due_date).getFullYear().toString();
        allYears.add(yearKey);

        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code) ||
          item.status !== 'rejected'
        ) {
          return;
        }

        if (!yearlyReject[yearKey]) {
          yearlyReject[yearKey] = { rejected: 0 };
        }

        yearlyReject[yearKey].rejected += 1;
      },
    );

    // Tambahkan tahun-tahun yang tidak ada data rejected-nya
    allYears.forEach((year) => {
      if (!yearlyReject[year]) {
        yearlyReject[year] = { rejected: 0 };
      }
    });

    const allYearlyReject = Array.from(allYears)
      .map((year) => ({
        year,
        rejected: yearlyReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .reverse()
      .slice(0, 5);

    return allYearlyReject;
  }
}

//INDUSTRY
// 1. Penolakan LoR
// 2. Penolakan LoA

//RETAIL
// 1. Penolakan LoR
// 2. Penolakan LoA
