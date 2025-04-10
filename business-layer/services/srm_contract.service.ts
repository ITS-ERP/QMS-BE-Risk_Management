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

  async getOnTimeAndLateSummary(
    industry_code?: string,
    supplier_code?: string,
  ) {
    const allYearlyData = await this.getAllOnTimeVsLateTrend(
      industry_code,
      supplier_code,
    );

    let totalOnTime = 0;
    let totalLate = 0;

    allYearlyData.forEach(({ on_time, late }) => {
      totalOnTime += on_time;
      totalLate += late;
    });

    const totalContract = totalOnTime + totalLate;

    return {
      total_contract: totalContract > 0 ? totalContract : '0',
      total_on_time: totalOnTime > 0 ? totalOnTime : '0',
      total_late: totalLate > 0 ? totalLate : '0',
      on_time_rate:
        totalContract > 0
          ? ((totalOnTime / totalContract) * 100).toFixed(2)
          : '0.00',
      late_rate:
        totalContract > 0
          ? ((totalLate / totalContract) * 100).toFixed(2)
          : '0.00',
    };
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

  async getLateReceiptSummary(supplier_code?: string, industry_code?: string) {
    const allYearlyTrend = await this.getAllOnTimeVsLateTrend(
      industry_code,
      supplier_code,
    );

    let totalOnTime = 0;
    let totalLate = 0;

    allYearlyTrend.forEach((item) => {
      totalOnTime += item.on_time;
      totalLate += item.late;
    });

    const totalContract = totalOnTime + totalLate;

    return {
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
  }

  // Summary untuk Jumlah Tidak Sesuai (SRM)
  async getQuantityMismatchSummary(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const complianceData = await this.getQuantityCompliance(
      industry_code,
      supplier_code,
    );

    let totalCompliant = 0;
    let totalNonCompliant = 0;

    complianceData.forEach((item) => {
      totalCompliant += item.compliant;
      totalNonCompliant += item.noncompliant;
    });

    const totalContracts = totalCompliant + totalNonCompliant;

    return {
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
  }

  // Summary untuk Tidak Lolos Cek Kebersihan
  async getCleanlinessCheckSummary(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const cleanlinessData = await this.getCleanlinessCheck(
      industry_code,
      supplier_code,
    );

    let totalPassed = 0;
    let totalNotPassed = 0;

    cleanlinessData.forEach((item) => {
      totalPassed += item.passed;
      totalNotPassed += item.notpassed;
    });

    const totalChecks = totalPassed + totalNotPassed;

    return {
      total_checks: totalChecks > 0 ? totalChecks : 0,
      passed_checks: totalPassed > 0 ? totalPassed : 0,
      failed_checks: totalNotPassed > 0 ? totalNotPassed : 0,
      pass_rate:
        totalChecks > 0
          ? parseFloat(((totalPassed / totalChecks) * 100).toFixed(2))
          : 0.0,
      fail_rate:
        totalChecks > 0
          ? parseFloat(((totalNotPassed / totalChecks) * 100).toFixed(2))
          : 0.0,
    };
  }

  // Summary untuk Tidak Lolos Cek Brix
  async getBrixCheckSummary(supplier_code?: string, industry_code?: string) {
    const brixData = await this.getBrixCheck(industry_code, supplier_code);

    let totalPassed = 0;
    let totalNotPassed = 0;

    brixData.forEach((item) => {
      totalPassed += item.passed;
      totalNotPassed += item.notpassed;
    });

    const totalChecks = totalPassed + totalNotPassed;

    return {
      total_checks: totalChecks > 0 ? totalChecks : 0,
      passed_checks: totalPassed > 0 ? totalPassed : 0,
      failed_checks: totalNotPassed > 0 ? totalNotPassed : 0,
      pass_rate:
        totalChecks > 0
          ? parseFloat(((totalPassed / totalChecks) * 100).toFixed(2))
          : 0.0,
      fail_rate:
        totalChecks > 0
          ? parseFloat(((totalNotPassed / totalChecks) * 100).toFixed(2))
          : 0.0,
    };
  }

  // Summary untuk Penurunan Jumlah Kontrak (SRM)
  async getContractDeclineSummary(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const contractData = await this.getContractTotal(
      industry_code,
      supplier_code,
    );

    if (contractData.length < 2) {
      return {
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
    }

    const currentYearData = contractData[contractData.length - 1];
    const previousYearData = contractData[contractData.length - 2];

    const currentYearContracts = currentYearData.total;
    const previousYearContracts = previousYearData.total;
    const totalContracts = currentYearContracts + previousYearContracts;

    // Hitung persentase pertumbuhan/penurunan
    let growthRate = 0.0;
    let declineRate = 0.0;

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

    return {
      current_year_contracts: currentYearContracts,
      previous_year_contracts: previousYearContracts,
      total_contracts: totalContracts,
      growth_rate: growthRate,
      decline_rate: declineRate,
    };
  }

  // Risk Rate Trend untuk Penerimaan terlambat
  async getLateReceiptRiskRateTrend(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const yearlyData = await this.getAllOnTimeVsLateTrend(
      industry_code,
      supplier_code,
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

    return riskRateTrend;
  }

  // Risk Rate Trend untuk Jumlah tidak sesuai
  async getQuantityMismatchRiskRateTrend(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const yearlyData = await this.getQuantityCompliance(
      industry_code,
      supplier_code,
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

    return riskRateTrend;
  }

  // Risk Rate Trend untuk Tidak lolos cek kebersihan
  async getCleanlinessCheckRiskRateTrend(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const yearlyData = await this.getCleanlinessCheck(
      industry_code,
      supplier_code,
    );

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.passed + item.notpassed;
      const riskRate =
        total > 0 ? parseFloat(((item.notpassed / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }

  // Risk Rate Trend untuk Tidak lolos cek brix
  async getBrixCheckRiskRateTrend(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const yearlyData = await this.getBrixCheck(industry_code, supplier_code);

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.passed + item.notpassed;
      const riskRate =
        total > 0 ? parseFloat(((item.notpassed / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }

  // Risk Rate Trend untuk Penurunan jumlah kontrak
  async getContractDeclineRiskRateTrend(
    supplier_code?: string,
    industry_code?: string,
  ) {
    const yearlyData = await this.getContractTotal(
      industry_code,
      supplier_code,
    );

    // Convert ke format yang diperlukan
    const riskRateTrend = [];

    // Kita perlu minimal 2 tahun data untuk menghitung penurunan
    if (yearlyData.length >= 2) {
      for (let i = 1; i < yearlyData.length; i++) {
        const currentYear = yearlyData[i];
        const previousYear = yearlyData[i - 1];

        // Hitung persentase penurunan jika ada penurunan
        let declineRate = 0;
        if (currentYear.total < previousYear.total) {
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

    return riskRateTrend;
  }
}
