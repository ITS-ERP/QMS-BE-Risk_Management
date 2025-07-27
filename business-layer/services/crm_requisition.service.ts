import { Request } from 'express';
import {
  getLetterOfRequestsViaRPC,
  getLetterOfAgreementsViaRPC,
} from '../../rabbit/requestCRMData';
interface LetterOfRequest {
  pkid: number;
  code: string;
  industry_pkid: number;
  confirmation_due_date: string;
  delivery_date: string;
  start_date: string | null;
  end_date: string | null;
  location: string;
  description: string;
  contract_type: string;
  status: string;
  message: string | null;
  tenant_id: number;
}
interface LetterOfAgreement {
  pkid: number;
  code: string;
  promotional_price: number;
  payment_method: string;
  down_payment_value: number | null;
  confirmation_due_date: string;
  status: string;
  letter_of_request_pkid: number;
  tenant_id: number;
}

export class CRMRequisitionService {
  async fetchAllCRMLoR(req: Request) {
    const tenant_id = 1;
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2030-12-31');
    const response = (await getLetterOfRequestsViaRPC(
      req,
      startDate,
      endDate,
      tenant_id,
    )) as LetterOfRequest[];

    return response;
  }
  async fetchAllCRMLoA(req: Request) {
    const tenant_id = 1;
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2030-12-31');
    const response = (await getLetterOfAgreementsViaRPC(
      req,
      startDate,
      endDate,
      tenant_id,
    )) as LetterOfAgreement[];

    return response;
  }

  async getAllLoRAcceptReject(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const mockReq = { headers: {} } as Request;
    const data = await this.fetchAllCRMLoR(mockReq);

    const yearlyAcceptReject: {
      [key: string]: { accepted: number; rejected: number };
    } = {};
    const filteredYears: Set<string> = new Set();
    const filteredData = data.filter((item: LetterOfRequest) => {
      let includeItem = true;

      if (industry_tenant_id && item.industry_pkid !== industry_tenant_id) {
        includeItem = false;
      }

      if (retail_tenant_id && item.tenant_id !== retail_tenant_id) {
        includeItem = false;
      }

      return includeItem;
    });

    filteredData.forEach((item: LetterOfRequest) => {
      const yearKey = new Date(item.confirmation_due_date)
        .getFullYear()
        .toString();
      filteredYears.add(yearKey);

      if (!yearlyAcceptReject[yearKey]) {
        yearlyAcceptReject[yearKey] = { accepted: 0, rejected: 0 };
      }

      if (
        item.status.toLowerCase() === 'approved' ||
        item.status.toLowerCase() === 'accepted'
      ) {
        yearlyAcceptReject[yearKey].accepted += 1;
      } else if (item.status.toLowerCase() === 'rejected') {
        yearlyAcceptReject[yearKey].rejected += 1;
      }
    });

    const allYearlyAcceptReject = Array.from(filteredYears)
      .map((year) => ({
        year,
        accepted: yearlyAcceptReject[year]?.accepted || 0,
        rejected: yearlyAcceptReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    return allYearlyAcceptReject;
  }

  async getLoRReject(industry_tenant_id?: number, retail_tenant_id?: number) {
    const mockReq = { headers: {} } as Request;
    const data = await this.fetchAllCRMLoR(mockReq);

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const filteredYears: Set<string> = new Set();
    const filteredData = data.filter((item: LetterOfRequest) => {
      let includeItem = true;

      if (industry_tenant_id && item.industry_pkid !== industry_tenant_id) {
        includeItem = false;
      }

      if (retail_tenant_id && item.tenant_id !== retail_tenant_id) {
        includeItem = false;
      }

      return includeItem;
    });

    filteredData.forEach((item: LetterOfRequest) => {
      const yearKey = new Date(item.confirmation_due_date)
        .getFullYear()
        .toString();
      filteredYears.add(yearKey);

      if (item.status.toLowerCase() === 'rejected') {
        if (!yearlyReject[yearKey]) {
          yearlyReject[yearKey] = { rejected: 0 };
        }
        yearlyReject[yearKey].rejected += 1;
      }
    });

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
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))
      .slice(0, 5);

    return allYearlyReject;
  }

  async getAllLoAAcceptReject(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const mockReq = { headers: {} } as Request;
    const loaData = await this.fetchAllCRMLoA(mockReq);
    const lorData = await this.fetchAllCRMLoR(mockReq);
    const lorToIndustryMapping = new Map<number, number>();
    lorData.forEach((lor: LetterOfRequest) => {
      lorToIndustryMapping.set(lor.pkid, lor.industry_pkid);
    });

    const yearlyAcceptReject: {
      [key: string]: { accepted: number; rejected: number };
    } = {};
    const filteredYears: Set<string> = new Set();
    const filteredData = loaData.filter((item: LetterOfAgreement) => {
      let includeItem = true;
      if (retail_tenant_id && item.tenant_id !== retail_tenant_id) {
        includeItem = false;
      }
      if (industry_tenant_id) {
        const relatedIndustryPkid = lorToIndustryMapping.get(
          item.letter_of_request_pkid,
        );
        if (relatedIndustryPkid !== industry_tenant_id) {
          includeItem = false;
        }
      }

      return includeItem;
    });

    filteredData.forEach((item: LetterOfAgreement) => {
      const yearKey = new Date(item.confirmation_due_date)
        .getFullYear()
        .toString();
      filteredYears.add(yearKey);

      if (!yearlyAcceptReject[yearKey]) {
        yearlyAcceptReject[yearKey] = { accepted: 0, rejected: 0 };
      }

      if (
        item.status.toLowerCase() === 'approved' ||
        item.status.toLowerCase() === 'accepted'
      ) {
        yearlyAcceptReject[yearKey].accepted += 1;
      } else if (item.status.toLowerCase() === 'rejected') {
        yearlyAcceptReject[yearKey].rejected += 1;
      }
    });

    const allYearlyAcceptReject = Array.from(filteredYears)
      .map((year) => ({
        year,
        accepted: yearlyAcceptReject[year]?.accepted || 0,
        rejected: yearlyAcceptReject[year]?.rejected || 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    return allYearlyAcceptReject;
  }

  async getLoAReject(industry_tenant_id?: number, retail_tenant_id?: number) {
    const mockReq = { headers: {} } as Request;
    const loaData = await this.fetchAllCRMLoA(mockReq);
    const lorData = await this.fetchAllCRMLoR(mockReq);
    const lorToIndustryMapping = new Map<number, number>();
    lorData.forEach((lor: LetterOfRequest) => {
      lorToIndustryMapping.set(lor.pkid, lor.industry_pkid);
    });

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const filteredYears: Set<string> = new Set();
    const filteredData = loaData.filter((item: LetterOfAgreement) => {
      let includeItem = true;
      if (retail_tenant_id && item.tenant_id !== retail_tenant_id) {
        includeItem = false;
      }
      if (industry_tenant_id) {
        const relatedIndustryPkid = lorToIndustryMapping.get(
          item.letter_of_request_pkid,
        );
        if (relatedIndustryPkid !== industry_tenant_id) {
          includeItem = false;
        }
      }

      return includeItem;
    });

    filteredData.forEach((item: LetterOfAgreement) => {
      const yearKey = new Date(item.confirmation_due_date)
        .getFullYear()
        .toString();
      filteredYears.add(yearKey);

      if (item.status.toLowerCase() === 'rejected') {
        if (!yearlyReject[yearKey]) {
          yearlyReject[yearKey] = { rejected: 0 };
        }
        yearlyReject[yearKey].rejected += 1;
      }
    });

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
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))
      .slice(0, 5);

    return allYearlyReject;
  }
  async getLoRRejectionSummary(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const lorData = await this.getAllLoRAcceptReject(
      industry_tenant_id,
      retail_tenant_id,
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
  async getLoARejectionSummary(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const loaData = await this.getAllLoAAcceptReject(
      industry_tenant_id,
      retail_tenant_id,
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
  async getLoRRejectionRiskRateTrend(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const yearlyData = await this.getAllLoRAcceptReject(
      industry_tenant_id,
      retail_tenant_id,
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
  async getLoARejectionRiskRateTrend(
    industry_tenant_id?: number,
    retail_tenant_id?: number,
  ) {
    const yearlyData = await this.getAllLoAAcceptReject(
      industry_tenant_id,
      retail_tenant_id,
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
