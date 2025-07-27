import { Request } from 'express';
import {
  getLetterOfRequestsViaRPC,
  getLetterOfAgreementsViaRPC,
} from '../../rabbit/requestCRMData';

// Interface untuk Letter of Request
interface LetterOfRequest {
  pkid: number;
  code: string;
  industry_pkid: number; // tenant_id milik industry
  confirmation_due_date: string;
  delivery_date: string;
  start_date: string | null;
  end_date: string | null;
  location: string;
  description: string;
  contract_type: string;
  status: string;
  message: string | null;
  tenant_id: number; // tenant_id milik retail
}

// Interface untuk Letter of Agreement
interface LetterOfAgreement {
  pkid: number;
  code: string;
  promotional_price: number;
  payment_method: string;
  down_payment_value: number | null;
  confirmation_due_date: string;
  status: string;
  letter_of_request_pkid: number;
  tenant_id: number; // tenant_id milik retail
}

export class CRMRequisitionService {
  // 🎯 UPDATED: Get all Letter of Request menggunakan RabbitMQ
  async fetchAllCRMLoR(req: Request) {
    // Create a mock tenant_id for RabbitMQ call since risk monitoring doesn't have specific tenant context
    // We'll use a broad range to get all data, then filter in the calling methods
    const tenant_id = 1; // Default tenant for broad data fetching

    // Gunakan tanggal default untuk range yang luas
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2030-12-31');

    // 🎯 USE RABBITMQ INSTEAD OF DIRECT API
    const response = (await getLetterOfRequestsViaRPC(
      req,
      startDate,
      endDate,
      tenant_id,
    )) as LetterOfRequest[];

    return response;
  }

  // 🎯 UPDATED: Get all Letter of Agreement menggunakan RabbitMQ
  async fetchAllCRMLoA(req: Request) {
    // Create a mock tenant_id for RabbitMQ call since risk monitoring doesn't have specific tenant context
    // We'll use a broad range to get all data, then filter in the calling methods
    const tenant_id = 1; // Default tenant for broad data fetching

    // Gunakan tanggal default untuk range yang luas
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2030-12-31');

    // 🎯 USE RABBITMQ INSTEAD OF DIRECT API
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
    // 🎯 Create mock request for RabbitMQ call
    const mockReq = { headers: {} } as Request;
    const data = await this.fetchAllCRMLoR(mockReq);

    const yearlyAcceptReject: {
      [key: string]: { accepted: number; rejected: number };
    } = {};
    const filteredYears: Set<string> = new Set();

    // Filter data berdasarkan tenant_id
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
    // 🎯 Create mock request for RabbitMQ call
    const mockReq = { headers: {} } as Request;
    const data = await this.fetchAllCRMLoR(mockReq);

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const filteredYears: Set<string> = new Set();

    // Filter data berdasarkan tenant_id
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
    // 🎯 Create mock request for RabbitMQ call
    const mockReq = { headers: {} } as Request;

    // Ambil data LoA dan LoR untuk join
    const loaData = await this.fetchAllCRMLoA(mockReq);
    const lorData = await this.fetchAllCRMLoR(mockReq);

    // Create mapping dari LoR pkid ke industry_pkid
    const lorToIndustryMapping = new Map<number, number>();
    lorData.forEach((lor: LetterOfRequest) => {
      lorToIndustryMapping.set(lor.pkid, lor.industry_pkid);
    });

    const yearlyAcceptReject: {
      [key: string]: { accepted: number; rejected: number };
    } = {};
    const filteredYears: Set<string> = new Set();

    // Filter data LoA berdasarkan tenant_id
    const filteredData = loaData.filter((item: LetterOfAgreement) => {
      let includeItem = true;

      // Filter berdasarkan retail tenant_id
      if (retail_tenant_id && item.tenant_id !== retail_tenant_id) {
        includeItem = false;
      }

      // Filter berdasarkan industry tenant_id (melalui join dengan LoR)
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
    // 🎯 Create mock request for RabbitMQ call
    const mockReq = { headers: {} } as Request;

    // Ambil data LoA dan LoR untuk join
    const loaData = await this.fetchAllCRMLoA(mockReq);
    const lorData = await this.fetchAllCRMLoR(mockReq);

    // Create mapping dari LoR pkid ke industry_pkid
    const lorToIndustryMapping = new Map<number, number>();
    lorData.forEach((lor: LetterOfRequest) => {
      lorToIndustryMapping.set(lor.pkid, lor.industry_pkid);
    });

    const yearlyReject: { [key: string]: { rejected: number } } = {};
    const filteredYears: Set<string> = new Set();

    // Filter data LoA berdasarkan tenant_id
    const filteredData = loaData.filter((item: LetterOfAgreement) => {
      let includeItem = true;

      // Filter berdasarkan retail tenant_id
      if (retail_tenant_id && item.tenant_id !== retail_tenant_id) {
        includeItem = false;
      }

      // Filter berdasarkan industry tenant_id (melalui join dengan LoR)
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

  // Summary untuk Penolakan LoR
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

  // Summary untuk Penolakan LoA
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

  // Risk Rate Trend untuk Penolakan LoR
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

  // Risk Rate Trend untuk Penolakan LoA
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
