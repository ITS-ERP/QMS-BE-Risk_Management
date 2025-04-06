import * as srmContractIntegration from '../../data-access/integrations/srm_contract.integration';

export class SRMContractService {
  async fetchAllSRMContract() {
    const response = await srmContractIntegration.getAllSRMContract();
    return response.data.data;
  }

  async getAllOnTimeVsLateTrend(
    industry_code?: string,
    supplier_code?: string,
  ) {
    const response = await srmContractIntegration.getAllSRMContract();
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
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
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

  async getLateTrend(industry_code?: string, supplier_code?: string) {
    const response = await srmContractIntegration.getAllSRMContract();
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
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
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

  async getQuantityCompliance(industry_code?: string, supplier_code?: string) {
    const response = await srmContractIntegration.getAllSRMContract();
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
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
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

  async getNonCompliantQuantity(
    industry_code?: string,
    supplier_code?: string,
  ) {
    const response = await srmContractIntegration.getAllSRMContract();
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
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
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

  async getCleanlinessCheck(industry_code?: string, supplier_code?: string) {
    const response = await srmContractIntegration.getAllSRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyCleanliness: {
      [key: string]: { passed: number; notpassed: number };
    } = {};

    data.forEach(
      (item: {
        clean: number;
        receipt_date_target: string;
        industry_code: string;
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
        ) {
          return;
        }

        const yearKey = new Date(item.receipt_date_target)
          .getFullYear()
          .toString();

        if (!yearlyCleanliness[yearKey]) {
          yearlyCleanliness[yearKey] = { passed: 0, notpassed: 0 };
        }

        if (item.clean === 1) {
          yearlyCleanliness[yearKey].passed += 1;
        } else {
          yearlyCleanliness[yearKey].notpassed += 1;
        }
      },
    );

    const allYearlyCleanliness = Object.entries(yearlyCleanliness)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return allYearlyCleanliness;
  }

  async getUncleanCheck(industry_code?: string, supplier_code?: string) {
    const response = await srmContractIntegration.getAllSRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyUnclean: { [key: string]: { notpassed: number } } = {};

    data.forEach(
      (item: {
        clean: number;
        receipt_date_target: string;
        industry_code: string;
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
        ) {
          return;
        }

        const yearKey = new Date(item.receipt_date_target)
          .getFullYear()
          .toString();

        if (!yearlyUnclean[yearKey]) {
          yearlyUnclean[yearKey] = { notpassed: 0 };
        }

        if (item.clean !== 1) {
          yearlyUnclean[yearKey].notpassed += 1;
        }
      },
    );

    const top5UncleanCheck = Object.entries(yearlyUnclean)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return top5UncleanCheck;
  }

  async getBrixCheck(industry_code?: string, supplier_code?: string) {
    const response = await srmContractIntegration.getAllSRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyBrix: { [key: string]: { passed: number; notpassed: number } } =
      {};

    data.forEach(
      (item: {
        brix_check_1: string;
        brix_check_2: string;
        receipt_date_target: string;
        industry_code: string;
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
        ) {
          return;
        }

        const yearKey = new Date(item.receipt_date_target)
          .getFullYear()
          .toString();
        const brix1 = parseFloat(item.brix_check_1);
        const brix2 = parseFloat(item.brix_check_2);

        if (!yearlyBrix[yearKey]) {
          yearlyBrix[yearKey] = { passed: 0, notpassed: 0 };
        }

        if (brix1 >= 13) {
          yearlyBrix[yearKey].passed += 1;
        } else {
          yearlyBrix[yearKey].notpassed += 1;
        }

        if (brix2 >= 13) {
          yearlyBrix[yearKey].passed += 1;
        } else {
          yearlyBrix[yearKey].notpassed += 1;
        }
      },
    );

    const allYearlyBrix = Object.entries(yearlyBrix)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, values]) => ({ year, ...values }))
      .reverse(); // Membalik urutan

    return allYearlyBrix;
  }

  async getUnderBrixCheck(industry_code?: string, supplier_code?: string) {
    const response = await srmContractIntegration.getAllSRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyUnderBrix: { [key: string]: { notpassed: number } } = {};

    data.forEach(
      (item: {
        brix_check_1: string;
        brix_check_2: string;
        receipt_date_target: string;
        industry_code: string;
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
        ) {
          return;
        }

        const yearKey = new Date(item.receipt_date_target)
          .getFullYear()
          .toString();
        const brix1 = parseFloat(item.brix_check_1);
        const brix2 = parseFloat(item.brix_check_2);

        if (!yearlyUnderBrix[yearKey]) {
          yearlyUnderBrix[yearKey] = { notpassed: 0 };
        }

        if (brix1 < 13) {
          yearlyUnderBrix[yearKey].notpassed += 1;
        }

        if (brix2 < 13) {
          yearlyUnderBrix[yearKey].notpassed += 1;
        }
      },
    );

    const top5UnderBrixCheck = Object.entries(yearlyUnderBrix)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .map(([year, values]) => ({ year, ...values }))
      .reverse(); // Membalik urutan

    return top5UnderBrixCheck;
  }

  async getContractTotal(industry_code?: string, supplier_code?: string) {
    const response = await srmContractIntegration.getAllSRMContract();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyTotal: { [key: string]: number } = {};

    data.forEach(
      (item: {
        receipt_date_target: string;
        industry_code: string;
        supplier_code: string;
      }) => {
        if (
          (industry_code && item.industry_code !== industry_code) ||
          (supplier_code && item.supplier_code !== supplier_code)
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

  //INDUSTRY
  // 1. Penerimaan terlambat
  // 2. Jumlah tidak sesuai
  // 3. Bahan baku kotor
  // 4. Cek brix 1 tidak lolos
  // 5. Cek brix 2 tidak lolos

  //SUPPLIER
  // 1. Penurunan jumlah contract
  // 2. Pengiriman terlambat
  // 3. Jumlah tidak sesuai
  // 4. Bahan baku kotor
  // 5. Cek brix 1 tidak lolos
  // 6. Cek brix 2 tidak lolos
}
