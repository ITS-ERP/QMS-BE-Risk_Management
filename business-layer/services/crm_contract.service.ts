import { Request } from 'express';
import {
  getContractsViaRPC,
  getContractDetailsWithShipmentsViaRPC,
} from '../../rabbit/requestCRMData';
interface Contract {
  pkid: number;
  code: string;
  industry_pkid: number;
  retail_pkid: number;
  start_date?: string;
  end_date?: string;
  amount_of_item?: number;
  contract_type?: string;
  payment_method?: string;
  status: string;
  letter_of_agreement_pkid: number;
  tenant_id: number | null;
  created_date: string;
}
interface HistoryShipment {
  pkid: number;
  code: string;
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
  contract_detail_pkid: number;
  tenant_id: number | null;
}
interface ContractDetailWithShipments {
  pkid: number;
  code: string;
  currency_code: string;
  target_total_price: number;
  tax_id: number;
  description: string;
  item_pkid: number;
  contract_pkid: number;
  tenant_id: number | null;
  history_shipments?: HistoryShipment[];
}
interface ShipmentWithContractInfo {
  shipment_pkid: number;
  target_date: string;
  delivered_date: string | null;
  target_quantity: number;
  total_quantity: number | null;
  total_accepted_quantity: number | null;
  total_rejected_quantity: number | null;
  status: string;
  contract_pkid: number;
  industry_pkid: number;
  retail_pkid: number;
  created_date: string;
  end_date?: string;
}

export class CRMContractService {
  async fetchAllCRMContract() {
    const mockReq = { headers: {} } as Request;
    const tenant_id = 1;
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2030-12-31');
    const response = (await getContractsViaRPC(
      mockReq,
      startDate,
      endDate,
      tenant_id,
    )) as Contract[];

    return response;
  }
  private async getAllShipmentsWithContractInfo(): Promise<
    ShipmentWithContractInfo[]
  > {
    try {
      const mockReq = { headers: {} } as Request;
      const contracts = await this.fetchAllCRMContract();
      const contractMap = new Map<number, Contract>();
      contracts.forEach((contract: Contract) => {
        contractMap.set(contract.pkid, contract);
      });
      const tenant_id = 1;
      const contractDetails = (await getContractDetailsWithShipmentsViaRPC(
        mockReq,
        tenant_id,
      )) as ContractDetailWithShipments[];

      const allShipments: ShipmentWithContractInfo[] = [];
      contractDetails.forEach((detail) => {
        const contract = contractMap.get(detail.contract_pkid);
        if (!contract) return;

        if (
          detail.history_shipments &&
          Array.isArray(detail.history_shipments)
        ) {
          detail.history_shipments.forEach((shipment) => {
            allShipments.push({
              shipment_pkid: shipment.pkid,
              target_date: shipment.target_date,
              delivered_date: shipment.delivered_date,
              target_quantity: shipment.target_quantity,
              total_quantity: shipment.total_quantity,
              total_accepted_quantity: shipment.total_accepted_quantity,
              total_rejected_quantity: shipment.total_rejected_quantity,
              status: shipment.status,
              contract_pkid: contract.pkid,
              industry_pkid: contract.industry_pkid,
              retail_pkid: contract.retail_pkid,
              created_date: contract.created_date,
              end_date: contract.end_date,
            });
          });
        }
      });

      return allShipments;
    } catch (error) {
      console.error('Error getting all shipments with contract info:', error);
      return [];
    }
  }
  private filterByTenant(
    shipments: ShipmentWithContractInfo[],
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ): ShipmentWithContractInfo[] {
    return shipments.filter((shipment) => {
      if (industry_tenant_id && shipment.industry_pkid !== industry_tenant_id) {
        return false;
      }
      if (retail_tenant_id && shipment.retail_pkid !== retail_tenant_id) {
        return false;
      }
      return true;
    });
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
    const filteredContracts = contractsData.filter((contract: Contract) => {
      if (industry_tenant_id && contract.industry_pkid !== industry_tenant_id) {
        return false;
      }
      if (retail_tenant_id && contract.retail_pkid !== retail_tenant_id) {
        return false;
      }
      return true;
    });
    filteredContracts.forEach((contract: Contract) => {
      if (contract.end_date) {
        const yearKey = new Date(contract.end_date).getFullYear().toString();
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
    const allShipments = await this.getAllShipmentsWithContractInfo();
    const filteredShipments = this.filterByTenant(
      allShipments,
      industry_tenant_id,
      retail_tenant_id,
    );

    const yearlyTrend: { [key: string]: { on_time: number; late: number } } =
      {};
    filteredShipments.forEach((shipment) => {
      if (shipment.target_date && shipment.delivered_date) {
        const targetDate = new Date(shipment.target_date);
        const deliveredDate = new Date(shipment.delivered_date);
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
    const allShipments = await this.getAllShipmentsWithContractInfo();
    const filteredShipments = this.filterByTenant(
      allShipments,
      industry_tenant_id,
      retail_tenant_id,
    );

    const yearlyCompliance: {
      [key: string]: { compliant: number; noncompliant: number };
    } = {};
    filteredShipments.forEach((shipment) => {
      if (
        shipment.target_date &&
        shipment.total_quantity !== null &&
        shipment.target_quantity
      ) {
        const yearKey = new Date(shipment.target_date).getFullYear().toString();

        if (!yearlyCompliance[yearKey]) {
          yearlyCompliance[yearKey] = { compliant: 0, noncompliant: 0 };
        }

        if (shipment.total_quantity >= shipment.target_quantity) {
          yearlyCompliance[yearKey].compliant += 1;
        } else {
          yearlyCompliance[yearKey].noncompliant += 1;
        }
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

    const totalShipments = totalOnTime + totalLate;

    return {
      total_shipments: totalShipments > 0 ? totalShipments : 0,
      on_time_deliveries: totalOnTime > 0 ? totalOnTime : 0,
      late_deliveries: totalLate > 0 ? totalLate : 0,
      on_time_rate:
        totalShipments > 0
          ? parseFloat(((totalOnTime / totalShipments) * 100).toFixed(2))
          : 0.0,
      late_delivery_rate:
        totalShipments > 0
          ? parseFloat(((totalLate / totalShipments) * 100).toFixed(2))
          : 0.0,
    };
  }
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

    const totalShipments = totalCompliant + totalNonCompliant;

    return {
      total_shipments: totalShipments,
      compliant_quantity: totalCompliant,
      mismatch_quantity: totalNonCompliant,
      compliant_rate:
        totalShipments > 0
          ? parseFloat(((totalCompliant / totalShipments) * 100).toFixed(2))
          : 0.0,
      mismatch_rate:
        totalShipments > 0
          ? parseFloat(((totalNonCompliant / totalShipments) * 100).toFixed(2))
          : 0.0,
    };
  }
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
