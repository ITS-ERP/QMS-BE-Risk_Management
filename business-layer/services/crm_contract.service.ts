import * as crmContractIntegration from '../../data-access/integrations/crm_contract.integration';

export class CRMContractService {
  async fetchAllCRMContract() {
    const response = await crmContractIntegration.getAllCRMContract();
    return response.data.data;
  }

  //INDUSTRY
  // 1. Penurunan jumlah kontrak
  async getContractTotal(industry_code?: string, retail_code?: string) {
    const response = await crmContractIntegration.getAllCRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyTotal: { [key: string]: number } = {};

    data.forEach(
      (item: {
        receipt_date_target: string;
        industry_code: string;
        retail_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const yearKey = new Date(item.receipt_date_target)
          .getFullYear()
          .toString();

        if (!yearlyTotal[yearKey]) {
          yearlyTotal[yearKey] = 0;
        }

        yearlyTotal[yearKey] += 1;
      },
    );

    const allYearlyTotal = Object.entries(yearlyTotal)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, total]) => ({ year, total }))
      .reverse();

    return allYearlyTotal;
  }

  // 2. Pengiriman terlambat
  async getAllOnTimeVsLateTrend(industry_code?: string, retail_code?: string) {
    const response = await crmContractIntegration.getAllCRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyTrend: { [key: string]: { on_time: number; late: number } } =
      {};

    data.forEach(
      (item: {
        receipt_date_target: string;
        receipt_date_actual: string;
        industry_code: string;
        retail_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const targetDate = new Date(item.receipt_date_target);
        const actualDate = new Date(item.receipt_date_actual);
        const yearKey = targetDate.getFullYear().toString();

        if (!yearlyTrend[yearKey]) {
          yearlyTrend[yearKey] = { on_time: 0, late: 0 };
        }

        if (actualDate <= targetDate) {
          yearlyTrend[yearKey].on_time += 1;
        } else {
          yearlyTrend[yearKey].late += 1;
        }
      },
    );

    const allYearlyTrend = Object.entries(yearlyTrend)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return allYearlyTrend;
  }

  async getLateTrend(industry_code?: string, retail_code?: string) {
    const response = await crmContractIntegration.getAllCRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyTrend: { [key: string]: { late: number } } = {};

    data.forEach(
      (item: {
        receipt_date_target: string;
        receipt_date_actual: string;
        industry_code: string;
        retail_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const targetDate = new Date(item.receipt_date_target);
        const actualDate = new Date(item.receipt_date_actual);
        const yearKey = targetDate.getFullYear().toString();

        if (!yearlyTrend[yearKey]) {
          yearlyTrend[yearKey] = { late: 0 };
        }

        if (actualDate > targetDate) {
          yearlyTrend[yearKey].late += 1;
        }
      },
    );

    const top5LateTrend = Object.entries(yearlyTrend)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return top5LateTrend;
  }

  // 3. Jumlah tidak sesuai
  async getQuantityCompliance(industry_code?: string, retail_code?: string) {
    const response = await crmContractIntegration.getAllCRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyCompliance: {
      [key: string]: { compliant: number; noncompliant: number };
    } = {};

    data.forEach(
      (item: {
        quantity_target: string;
        quantity_actual: string;
        receipt_date_target: string;
        industry_code: string;
        retail_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const yearKey = new Date(item.receipt_date_target)
          .getFullYear()
          .toString();
        const targetQuantity = parseFloat(item.quantity_target);
        const actualQuantity = parseFloat(item.quantity_actual);

        if (!yearlyCompliance[yearKey]) {
          yearlyCompliance[yearKey] = { compliant: 0, noncompliant: 0 };
        }

        if (actualQuantity >= targetQuantity) {
          yearlyCompliance[yearKey].compliant += 1;
        } else {
          yearlyCompliance[yearKey].noncompliant += 1;
        }
      },
    );

    const allYearlyCompliance = Object.entries(yearlyCompliance)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return allYearlyCompliance;
  }

  async getNonCompliantQuantity(industry_code?: string, retail_code?: string) {
    const response = await crmContractIntegration.getAllCRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyNonCompliance: { [key: string]: { noncompliant: number } } = {};

    data.forEach(
      (item: {
        quantity_target: string;
        quantity_actual: string;
        receipt_date_target: string;
        industry_code: string;
        retail_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (retail_code && item.retail_code !== retail_code)
        ) {
          return;
        }

        const yearKey = new Date(item.receipt_date_target)
          .getFullYear()
          .toString();
        const targetQuantity = parseFloat(item.quantity_target);
        const actualQuantity = parseFloat(item.quantity_actual);

        if (!yearlyNonCompliance[yearKey]) {
          yearlyNonCompliance[yearKey] = { noncompliant: 0 };
        }

        if (actualQuantity < targetQuantity) {
          yearlyNonCompliance[yearKey].noncompliant += 1;
        }
      },
    );

    const top5NonCompliantQuantity = Object.entries(yearlyNonCompliance)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return top5NonCompliantQuantity;
  }

  //RETAIL
  // 1. Penerimaan terlambat
  // 2. Jumlah tidak sesuai
}
