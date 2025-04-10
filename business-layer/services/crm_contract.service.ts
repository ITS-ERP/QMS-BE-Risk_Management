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

  async getContractDeclineSummary(
    industry_code?: string,
    retail_code?: string,
  ) {
    const contractData = await this.getContractTotal(
      industry_code,
      retail_code,
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

  // Summary untuk Pengiriman Terlambat (CRM)
  async getLateDeliverySummary(industry_code?: string, retail_code?: string) {
    const onTimeLateTrend = await this.getAllOnTimeVsLateTrend(
      industry_code,
      retail_code,
    );

    let totalOnTime = 0;
    let totalLate = 0;

    onTimeLateTrend.forEach((item) => {
      totalOnTime += item.on_time;
      totalLate += item.late;
    });

    const totalDeliveries = totalOnTime + totalLate;

    return {
      total_deliveries: totalDeliveries > 0 ? totalDeliveries : 0,
      on_time_deliveries: totalOnTime > 0 ? totalOnTime : 0,
      late_deliveries: totalLate > 0 ? totalLate : 0,
      on_time_rate:
        totalDeliveries > 0
          ? parseFloat(((totalOnTime / totalDeliveries) * 100).toFixed(2))
          : 0.0,
      late_delivery_rate:
        totalDeliveries > 0
          ? parseFloat(((totalLate / totalDeliveries) * 100).toFixed(2))
          : 0.0,
    };
  }

  // Summary untuk Jumlah Tidak Sesuai (CRM)
  async getQuantityMismatchSummary(
    industry_code?: string,
    retail_code?: string,
  ) {
    const complianceData = await this.getQuantityCompliance(
      industry_code,
      retail_code,
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

  async getContractDeclineRiskRateTrend(
    industry_code?: string,
    retail_code?: string,
  ) {
    const yearlyData = await this.getContractTotal(industry_code, retail_code);

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

  // Risk Rate Trend untuk Pengiriman terlambat
  async getLateDeliveryRiskRateTrend(
    industry_code?: string,
    retail_code?: string,
  ) {
    const yearlyData = await this.getAllOnTimeVsLateTrend(
      industry_code,
      retail_code,
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
    industry_code?: string,
    retail_code?: string,
  ) {
    const yearlyData = await this.getQuantityCompliance(
      industry_code,
      retail_code,
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
}
