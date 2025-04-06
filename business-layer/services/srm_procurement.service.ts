import * as srmProcurementIntegration from '../../data-access/integrations/srm_procurement.integration';

export class SRMProcurementService {
  async fetchAllSRMProcurement() {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    return response.data.data;
  }

  //INDUSTRY
  //1. Keterlambatan RFQ dari purchase request

  //SUPPLIER
  //1. Kekalahan pada proses RFQ
  async getWinLoseCount(supplier_code: string) {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyWinLose: { [key: string]: { win: number; lose: number } } = {};

    data.forEach(
      (item: { end_date: string; supplier_code: string; status: string }) => {
        if (item.supplier_code !== supplier_code) {
          return;
        }

        const yearKey = new Date(item.end_date).getFullYear().toString();

        if (!yearlyWinLose[yearKey]) {
          yearlyWinLose[yearKey] = { win: 0, lose: 0 };
        }

        if (item.status === 'win') {
          yearlyWinLose[yearKey].win += 1;
        } else if (item.status === 'lose') {
          yearlyWinLose[yearKey].lose += 1;
        }
      },
    );

    const allYearlyWinLose = Object.entries(yearlyWinLose)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return allYearlyWinLose;
  }

  async getLoseCount(supplier_code: string) {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyLoseCount: { [key: string]: { lose: number } } = {};
    const allYears: Set<string> = new Set();

    data.forEach(
      (item: { end_date: string; supplier_code: string; status: string }) => {
        const yearKey = new Date(item.end_date).getFullYear().toString();
        allYears.add(yearKey);

        if (item.supplier_code !== supplier_code || item.status !== 'lose') {
          return;
        }

        if (!yearlyLoseCount[yearKey]) {
          yearlyLoseCount[yearKey] = { lose: 0 };
        }

        yearlyLoseCount[yearKey].lose += 1;
      },
    );

    const allYearlyLoseCount = Array.from(allYears)
      .map((year) => ({
        year,
        lose: yearlyLoseCount[year]?.lose || 0,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();

    return allYearlyLoseCount;
  }
}
