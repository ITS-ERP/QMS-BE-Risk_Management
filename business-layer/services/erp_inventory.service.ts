import * as inventoryIntegration from '../../data-access/integrations/erp_inventory.integration';

export class InventoryService {
  async fetchAllReceive() {
    const response = await inventoryIntegration.getAllReceive();
    return response.data.data;
  }

  async fetchAllTransfer() {
    const response = await inventoryIntegration.getAllTransfer();
    return response.data.data;
  }

  async getReceiveType() {
    const response = await inventoryIntegration.getAllReceive();
    const data = response.data.data;

    let accept = 0;
    let reject = 0;

    data.forEach(
      (item: {
        receiveDetails: {
          item_accepted_quantity: string;
          item_rejected_quantity: string;
        }[];
      }) => {
        item.receiveDetails.forEach((detail) => {
          const acceptedQuantity = parseFloat(detail.item_accepted_quantity);
          const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
          accept += acceptedQuantity;
          reject += rejectedQuantity;
        });
      },
    );

    const total = accept + reject;
    return { accept, reject, total };
  }

  async getReceiveByMonth() {
    const response = await inventoryIntegration.getAllReceive();
    const data = response.data.data;

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

    data.forEach(
      (item: {
        received_date: string;
        receiveDetails: {
          item_accepted_quantity: string;
          item_rejected_quantity: string;
        }[];
      }) => {
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
      },
    );

    const top5Monthly = Object.entries(monthlyData)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5)
      .map(([month, values]) => ({ month, ...values }));

    return top5Monthly;
  }

  async getAllReceiveByYear() {
    const response = await inventoryIntegration.getAllReceive();
    const data = response.data.data;

    const yearlyData: { [key: string]: { accept: number; reject: number } } =
      {};

    data.forEach(
      (item: {
        received_date: string;
        receiveDetails: {
          item_accepted_quantity: string;
          item_rejected_quantity: string;
        }[];
      }) => {
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
      },
    );

    const allYearlyData = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyData;
  }

  async getReceiveSummary() {
    const allYearlyData = await this.getAllReceiveByYear();

    let totalAccept = 0;
    let totalReject = 0;

    allYearlyData.forEach(({ accept, reject }) => {
      totalAccept += accept;
      totalReject += reject;
    });

    const totalQuantity = totalAccept + totalReject;

    return {
      total_quantity: totalQuantity > 0 ? totalQuantity : '0',
      total_accept: totalAccept > 0 ? totalAccept : '0',
      total_reject: totalReject > 0 ? totalReject : '0',
      accept_rate:
        totalQuantity > 0
          ? ((totalAccept / totalQuantity) * 100).toFixed(2)
          : '0.00',
      reject_rate:
        totalQuantity > 0
          ? ((totalReject / totalQuantity) * 100).toFixed(2)
          : '0.00',
    };
  }

  async getRejectReceiveByYear() {
    const response = await inventoryIntegration.getAllReceive();
    const data = response.data.data;

    const yearlyData: { [key: string]: { reject: number } } = {};

    data.forEach(
      (item: {
        received_date: string;
        receiveDetails: {
          item_rejected_quantity: string;
        }[];
      }) => {
        const receivedDate = new Date(item.received_date);
        const yearKey = receivedDate.getFullYear().toString();

        if (!yearlyData[yearKey]) {
          yearlyData[yearKey] = { reject: 0 };
        }

        item.receiveDetails.forEach((detail) => {
          const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
          yearlyData[yearKey].reject += rejectedQuantity;
        });
      },
    );

    const top5Yearly = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return top5Yearly;
  }

  async getAllTransferByYear() {
    const response = await inventoryIntegration.getAllTransfer();
    const data = response.data.data;

    const yearlyData: { [key: string]: { accept: number; reject: number } } =
      {};

    data.forEach(
      (item: {
        transfer_date: string;
        transferDetails: {
          item_accepted_quantity: string;
          item_rejected_quantity: string;
        }[];
      }) => {
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
      },
    );

    const allYearlyData = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyData;
  }

  async getTransferSummary() {
    const allYearlyData = await this.getAllTransferByYear();

    let totalAccept = 0;
    let totalReject = 0;

    allYearlyData.forEach(({ accept, reject }) => {
      totalAccept += accept;
      totalReject += reject;
    });

    const totalQuantity = totalAccept + totalReject;

    return {
      total_quantity: totalQuantity > 0 ? totalQuantity : '0',
      total_accept: totalAccept > 0 ? totalAccept : '0',
      total_reject: totalReject > 0 ? totalReject : '0',
      accept_rate:
        totalQuantity > 0
          ? ((totalAccept / totalQuantity) * 100).toFixed(2)
          : '0.00',
      reject_rate:
        totalQuantity > 0
          ? ((totalReject / totalQuantity) * 100).toFixed(2)
          : '0.00',
    };
  }

  async getRejectTransferByYear() {
    const response = await inventoryIntegration.getAllTransfer();
    const data = response.data.data;

    const yearlyData: { [key: string]: { reject: number } } = {};

    data.forEach(
      (item: {
        transfer_date: string;
        transferDetails: {
          item_rejected_quantity: string;
        }[];
      }) => {
        const transferDate = new Date(item.transfer_date);
        const yearKey = transferDate.getFullYear().toString();

        if (!yearlyData[yearKey]) {
          yearlyData[yearKey] = { reject: 0 };
        }

        item.transferDetails.forEach((detail) => {
          const rejectedQuantity = parseFloat(detail.item_rejected_quantity);
          yearlyData[yearKey].reject += rejectedQuantity;
        });
      },
    );

    const top5Yearly = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return top5Yearly;
  }
}
