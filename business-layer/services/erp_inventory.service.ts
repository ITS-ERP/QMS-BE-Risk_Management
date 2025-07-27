import { Request } from 'express';
import { getQMSContext } from '../../data-access/utility/requestHelper';
import {
  ReceiveItem,
  TransferItem,
} from '../../data-access/utility/interfaces';
import {
  getReceivesViaRPC,
  getTransfersViaRPC,
} from '../../rabbit/requestERPData';

export class InventoryService {
  async fetchAllReceive(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<ReceiveItem[]> {
    const context = getQMSContext(req);
    const response = (await getReceivesViaRPC(
      req,
      context.tenant_id_number,
    )) as ReceiveItem[];
    const targetTenantId = industry_tenant_id || context.tenant_id_number;
    const filteredData = response.filter(
      (item: ReceiveItem) =>
        item.tenant_id === targetTenantId || item.tenant_id === null,
    );

    return filteredData;
  }

  async getReceiveType(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<{ accept: number; reject: number; total: number }> {
    const data = await this.fetchAllReceive(req, industry_tenant_id);

    let accept = 0;
    let reject = 0;

    data.forEach((item: ReceiveItem) => {
      item.receiveDetails.forEach((detail) => {
        const acceptedQuantity = parseFloat(detail.item_accepted_quantity);
        const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
        accept += acceptedQuantity;
        reject += rejectedQuantity;
      });
    });

    const total = accept + reject;
    return { accept, reject, total };
  }

  async getReceiveByMonth(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ month: string; accept: number; reject: number }>> {
    const data = await this.fetchAllReceive(req, industry_tenant_id);

    const monthlyData: { [key: string]: { accept: number; reject: number } } =
      {};
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    data.forEach((item: ReceiveItem) => {
      const receivedDate = new Date(item.received_date);
      const monthKey = `${monthNames[receivedDate.getMonth()]} ${receivedDate.getFullYear()}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { accept: 0, reject: 0 };
      }

      item.receiveDetails.forEach((detail) => {
        const acceptedQuantity = parseFloat(detail.item_accepted_quantity);
        const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
        monthlyData[monthKey].accept += acceptedQuantity;
        monthlyData[monthKey].reject += rejectedQuantity;
      });
    });

    const top5Monthly = Object.entries(monthlyData)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5)
      .reverse()
      .map(([month, values]) => ({ month, ...values }));

    return top5Monthly;
  }

  async getAllReceiveByYear(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; accept: number; reject: number }>> {
    const data = await this.fetchAllReceive(req, industry_tenant_id);

    const yearlyData: { [key: string]: { accept: number; reject: number } } =
      {};

    data.forEach((item: ReceiveItem) => {
      const receivedDate = new Date(item.received_date);
      const yearKey = receivedDate.getFullYear().toString();

      if (!yearlyData[yearKey]) {
        yearlyData[yearKey] = { accept: 0, reject: 0 };
      }

      item.receiveDetails.forEach((detail) => {
        const acceptedQuantity = parseFloat(detail.item_accepted_quantity);
        const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
        yearlyData[yearKey].accept += acceptedQuantity;
        yearlyData[yearKey].reject += rejectedQuantity;
      });
    });

    const allYearlyData = Object.entries(yearlyData)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyData;
  }

  async getReceiveSummary(req: Request, industry_tenant_id?: number) {
    const allYearlyData = await this.getAllReceiveByYear(
      req,
      industry_tenant_id,
    );

    let totalAccept = 0;
    let totalReject = 0;

    allYearlyData.forEach(({ accept, reject }) => {
      totalAccept += accept;
      totalReject += reject;
    });

    const totalQuantity = totalAccept + totalReject;

    return {
      total_quantity: totalQuantity > 0 ? totalQuantity : 0,
      total_accept: totalAccept > 0 ? totalAccept : 0,
      total_reject: totalReject > 0 ? totalReject : 0,
      accept_rate:
        totalQuantity > 0
          ? parseFloat(((totalAccept / totalQuantity) * 100).toFixed(2))
          : 0.0,
      reject_rate:
        totalQuantity > 0
          ? parseFloat(((totalReject / totalQuantity) * 100).toFixed(2))
          : 0.0,
    };
  }

  async getRejectReceiveByYear(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; reject: number }>> {
    const data = await this.fetchAllReceive(req, industry_tenant_id);

    const yearlyData: { [key: string]: { reject: number } } = {};

    data.forEach((item: ReceiveItem) => {
      const receivedDate = new Date(item.received_date);
      const yearKey = receivedDate.getFullYear().toString();

      if (!yearlyData[yearKey]) {
        yearlyData[yearKey] = { reject: 0 };
      }

      item.receiveDetails.forEach((detail) => {
        const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
        yearlyData[yearKey].reject += rejectedQuantity;
      });
    });

    const top5Yearly = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return top5Yearly;
  }

  async fetchAllTransfer(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<TransferItem[]> {
    const context = getQMSContext(req);
    const response = (await getTransfersViaRPC(
      req,
      context.tenant_id_number,
    )) as TransferItem[];
    const targetTenantId = industry_tenant_id || context.tenant_id_number;
    const filteredData = response.filter(
      (item: TransferItem) =>
        item.tenant_id === targetTenantId || item.tenant_id === null,
    );

    return filteredData;
  }

  async getTransferType(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<{ accept: number; reject: number; total: number }> {
    const data = await this.fetchAllTransfer(req, industry_tenant_id);

    let accept = 0;
    let reject = 0;

    data.forEach((item: TransferItem) => {
      item.transferDetails.forEach((detail) => {
        const acceptedQuantity = parseFloat(detail.item_accepted_quantity);
        const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
        accept += acceptedQuantity;
        reject += rejectedQuantity;
      });
    });

    const total = accept + reject;
    return { accept, reject, total };
  }

  async getAllTransferByYear(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; accept: number; reject: number }>> {
    const data = await this.fetchAllTransfer(req, industry_tenant_id);

    const yearlyData: { [key: string]: { accept: number; reject: number } } =
      {};

    data.forEach((item: TransferItem) => {
      const transferDate = new Date(item.transfer_date);
      const yearKey = transferDate.getFullYear().toString();

      if (!yearlyData[yearKey]) {
        yearlyData[yearKey] = { accept: 0, reject: 0 };
      }

      item.transferDetails.forEach((detail) => {
        const acceptedQuantity = parseFloat(detail.item_accepted_quantity);
        const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
        yearlyData[yearKey].accept += acceptedQuantity;
        yearlyData[yearKey].reject += rejectedQuantity;
      });
    });

    const allYearlyData = Object.entries(yearlyData)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyData;
  }

  async getTransferSummary(req: Request, industry_tenant_id?: number) {
    const allYearlyData = await this.getAllTransferByYear(
      req,
      industry_tenant_id,
    );

    let totalAccept = 0;
    let totalReject = 0;

    allYearlyData.forEach(({ accept, reject }) => {
      totalAccept += accept;
      totalReject += reject;
    });

    const totalQuantity = totalAccept + totalReject;

    return {
      total_quantity: totalQuantity > 0 ? totalQuantity : 0,
      total_accept: totalAccept > 0 ? totalAccept : 0,
      total_reject: totalReject > 0 ? totalReject : 0,
      accept_rate:
        totalQuantity > 0
          ? parseFloat(((totalAccept / totalQuantity) * 100).toFixed(2))
          : 0.0,
      reject_rate:
        totalQuantity > 0
          ? parseFloat(((totalReject / totalQuantity) * 100).toFixed(2))
          : 0.0,
    };
  }

  async getRejectTransferByYear(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; reject: number }>> {
    const data = await this.fetchAllTransfer(req, industry_tenant_id);

    const yearlyData: { [key: string]: { reject: number } } = {};

    data.forEach((item: TransferItem) => {
      const transferDate = new Date(item.transfer_date);
      const yearKey = transferDate.getFullYear().toString();

      if (!yearlyData[yearKey]) {
        yearlyData[yearKey] = { reject: 0 };
      }

      item.transferDetails.forEach((detail) => {
        const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
        yearlyData[yearKey].reject += rejectedQuantity;
      });
    });

    const top5Yearly = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return top5Yearly;
  }

  async getReceiveRiskRateTrend(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; value: number }>> {
    const yearlyData = await this.getAllReceiveByYear(req, industry_tenant_id);

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.accept + item.reject;
      const riskRate =
        total > 0 ? parseFloat(((item.reject / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }

  async getTransferRiskRateTrend(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; value: number }>> {
    const yearlyData = await this.getAllTransferByYear(req, industry_tenant_id);

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.accept + item.reject;
      const riskRate =
        total > 0 ? parseFloat(((item.reject / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }
}
