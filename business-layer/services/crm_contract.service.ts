import * as crmContractIntegration from '../../data-access/integrations/crm_contract.integration';

// Interface untuk Contract
interface Contract {
  pkid: number;
  code: string;
  industry_pkid: number; // tenant_id milik industry
  retail_pkid: number; // tenant_id milik retail
  status: string;
  letter_of_agreement_pkid: number;
  tenant_id: number | null;
  created_date: string;
}

// Interface untuk Contract Details
interface ContractDetail {
  pkid: number;
  code: string;
  currency_code: string;
  target_date: string;
  delivered_date: string | null;
  target_quantity: number;
  total_quantity: number | null;
  total_accepted_quantity: number | null;
  total_rejected_quantity: number | null;
  is_rejected: boolean;
  price_per_item: number;
  total_price: number;
  description: string;
  status: string;
  item_pkid: number;
  contract_pkid: number;
  tenant_id: number | null;
}

// Interface untuk Contract dengan Details
interface ContractWithDetails extends Contract {
  details: ContractDetail[];
}

export class CRMContractService {
  async fetchAllCRMContract() {
    const response = await crmContractIntegration.getAllContracts();
    return response.data.data;
  }

  async fetchContractDetailsByContractID(pkid: number) {
    const response =
      await crmContractIntegration.getContractDetailsByContractID(pkid);
    return response.data.data;
  }

  async getContractTotal(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const contractsData = await this.fetchAllCRMContract();

    if (!Array.isArray(contractsData)) {
      throw new Error('Contracts data is not an array');
    }

    const yearlyTotal: { [key: string]: number } = {};

    // Get contract details untuk mendapatkan target_date
    const contractsWithDetails: ContractWithDetails[] = await Promise.all(
      contractsData.map(async (contract: Contract) => {
        try {
          const details = await this.fetchContractDetailsByContractID(
            contract.pkid,
          );
          return {
            ...contract,
            details: Array.isArray(details) ? details : [],
          };
        } catch (error) {
          return {
            ...contract,
            details: [],
          };
        }
      }),
    );

    // Filter dan hitung berdasarkan tenant_id
    contractsWithDetails.forEach((contract: ContractWithDetails) => {
      let includeItem = true;

      if (industry_tenant_id && contract.industry_pkid !== industry_tenant_id) {
        includeItem = false;
      }

      if (retail_tenant_id && contract.retail_pkid !== retail_tenant_id) {
        includeItem = false;
      }

      if (includeItem && contract.details.length > 0) {
        // Gunakan target_date dari detail pertama
        const yearKey = new Date(contract.details[0].target_date)
          .getFullYear()
          .toString();

        if (!yearlyTotal[yearKey]) {
          yearlyTotal[yearKey] = 0;
        }

        yearlyTotal[yearKey] += 1;
      }
    });

    const allYearlyTotal = Object.entries(yearlyTotal)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, total]) => ({ year, total }));

    return allYearlyTotal;
  }

  async getAllOnTimeVsLateTrend(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const contractsData = await this.fetchAllCRMContract();

    if (!Array.isArray(contractsData)) {
      throw new Error('Contracts data is not an array');
    }

    const yearlyTrend: { [key: string]: { on_time: number; late: number } } =
      {};

    // Get contract details untuk setiap contract
    const contractsWithDetails: ContractWithDetails[] = await Promise.all(
      contractsData.map(async (contract: Contract) => {
        try {
          const details = await this.fetchContractDetailsByContractID(
            contract.pkid,
          );
          return {
            ...contract,
            details: Array.isArray(details) ? details : [],
          };
        } catch (error) {
          return {
            ...contract,
            details: [],
          };
        }
      }),
    );

    // Filter dan analisis
    contractsWithDetails.forEach((contract: ContractWithDetails) => {
      let includeItem = true;

      if (industry_tenant_id && contract.industry_pkid !== industry_tenant_id) {
        includeItem = false;
      }

      if (retail_tenant_id && contract.retail_pkid !== retail_tenant_id) {
        includeItem = false;
      }

      if (includeItem && contract.details.length > 0) {
        contract.details.forEach((detail: ContractDetail) => {
          if (detail.target_date && detail.delivered_date) {
            const targetDate = new Date(detail.target_date);
            const deliveredDate = new Date(detail.delivered_date);
            const yearKey = targetDate.getFullYear().toString();

            if (!yearlyTrend[yearKey]) {
              yearlyTrend[yearKey] = { on_time: 0, late: 0 };
            }

            if (deliveredDate <= targetDate) {
              yearlyTrend[yearKey].on_time += 1;
            } else {
              yearlyTrend[yearKey].late += 1;
            }
          }
        });
      }
    });

    const allYearlyTrend = Object.entries(yearlyTrend)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyTrend;
  }

  async getLateTrend(industry_tenant_id?: number, retail_tenant_id?: number) {
    const allTrend = await this.getAllOnTimeVsLateTrend(
      industry_tenant_id,
      retail_tenant_id,
    );

    return allTrend
      .map((item) => ({
        year: item.year,
        late: item.late,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();
  }

  async getQuantityCompliance(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const contractsData = await this.fetchAllCRMContract();

    if (!Array.isArray(contractsData)) {
      throw new Error('Contracts data is not an array');
    }

    const yearlyCompliance: {
      [key: string]: { compliant: number; noncompliant: number };
    } = {};

    // Get contract details untuk setiap contract
    const contractsWithDetails: ContractWithDetails[] = await Promise.all(
      contractsData.map(async (contract: Contract) => {
        try {
          const details = await this.fetchContractDetailsByContractID(
            contract.pkid,
          );
          return {
            ...contract,
            details: Array.isArray(details) ? details : [],
          };
        } catch (error) {
          return {
            ...contract,
            details: [],
          };
        }
      }),
    );

    // Filter dan analisis
    contractsWithDetails.forEach((contract: ContractWithDetails) => {
      let includeItem = true;

      if (industry_tenant_id && contract.industry_pkid !== industry_tenant_id) {
        includeItem = false;
      }

      if (retail_tenant_id && contract.retail_pkid !== retail_tenant_id) {
        includeItem = false;
      }

      if (includeItem && contract.details.length > 0) {
        contract.details.forEach((detail: ContractDetail) => {
          const yearKey = new Date(detail.target_date).getFullYear().toString();

          if (detail.total_quantity !== null && detail.target_quantity) {
            if (!yearlyCompliance[yearKey]) {
              yearlyCompliance[yearKey] = { compliant: 0, noncompliant: 0 };
            }

            if (detail.total_quantity >= detail.target_quantity) {
              yearlyCompliance[yearKey].compliant += 1;
            } else {
              yearlyCompliance[yearKey].noncompliant += 1;
            }
          }
        });
      }
    });

    const allYearlyCompliance = Object.entries(yearlyCompliance)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyCompliance;
  }

  async getNonCompliantQuantity(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const complianceData = await this.getQuantityCompliance(
      industry_tenant_id,
      retail_tenant_id,
    );

    return complianceData
      .map((item) => ({
        year: item.year,
        noncompliant: item.noncompliant,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();
  }

  // Summary untuk Penurunan Kontrak
  async getContractDeclineSummary(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const contractData = await this.getContractTotal(
      industry_tenant_id,
      retail_tenant_id,
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

  // Summary untuk Pengiriman Terlambat
  async getLateDeliverySummary(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const onTimeLateTrend = await this.getAllOnTimeVsLateTrend(
      industry_tenant_id,
      retail_tenant_id,
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

  // Summary untuk Jumlah Tidak Sesuai
  async getQuantityMismatchSummary(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const complianceData = await this.getQuantityCompliance(
      industry_tenant_id,
      retail_tenant_id,
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

  // Risk Rate Trend untuk Penurunan Kontrak
  async getContractDeclineRiskRateTrend(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const yearlyData = await this.getContractTotal(
      industry_tenant_id,
      retail_tenant_id,
    );

    const riskRateTrend = [];

    if (yearlyData.length >= 2) {
      for (let i = 1; i < yearlyData.length; i++) {
        const currentYear = yearlyData[i];
        const previousYear = yearlyData[i - 1];

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
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const yearlyData = await this.getAllOnTimeVsLateTrend(
      industry_tenant_id,
      retail_tenant_id,
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
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const yearlyData = await this.getQuantityCompliance(
      industry_tenant_id,
      retail_tenant_id,
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
