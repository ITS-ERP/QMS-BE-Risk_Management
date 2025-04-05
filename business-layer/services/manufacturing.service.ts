import * as manufacturingIntegration from '../../data-access/integrations/manufacturing.integration';

export class ManufacturingService {
  async fetchProductionRequestHeader() {
    const response =
      await manufacturingIntegration.getProductionRequestHeader();
    return response.data.data;
  }

  async fetchInspectionProduct() {
    const response = await manufacturingIntegration.getInspectionProduct();
    return response.data.data;
  }

  async getProductionType() {
    const response =
      await manufacturingIntegration.getProductionRequestHeader();
    const data = response.data.data;

    let make_to_stock = 0;
    let make_to_order = 0;

    data.forEach(
      (item: { quantity: string; sales_order_pkid: number | null }) => {
        const quantity = parseFloat(item.quantity);
        if (item.sales_order_pkid === null) {
          make_to_stock += quantity;
        } else {
          make_to_order += quantity;
        }
      },
    );

    const total = make_to_stock + make_to_order;
    return { make_to_stock, make_to_order, total };
  }

  async getProductionByMonth() {
    const response =
      await manufacturingIntegration.getProductionRequestHeader();
    const data = response.data.data;

    const monthlyData: {
      [key: string]: { make_to_stock: number; make_to_order: number };
    } = {};
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
        quantity: string;
        sales_order_pkid: number | null;
        start_date: string;
      }) => {
        const quantity = parseFloat(item.quantity);
        const startDate = new Date(item.start_date);
        const monthKey = `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { make_to_stock: 0, make_to_order: 0 };
        }

        if (item.sales_order_pkid === null) {
          monthlyData[monthKey].make_to_stock += quantity;
        } else {
          monthlyData[monthKey].make_to_order += quantity;
        }
      },
    );

    const top5Monthly = Object.entries(monthlyData)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5)
      .map(([month, values]) => ({ month, ...values }));

    return top5Monthly;
  }

  async getProductionByYear() {
    const response =
      await manufacturingIntegration.getProductionRequestHeader();
    const data = response.data.data;

    const yearlyData: {
      [key: string]: { make_to_stock: number; make_to_order: number };
    } = {};

    data.forEach(
      (item: {
        quantity: string;
        sales_order_pkid: number | null;
        start_date: string;
      }) => {
        const quantity = parseFloat(item.quantity);
        const startDate = new Date(item.start_date);
        const yearKey = startDate.getFullYear().toString();

        if (!yearlyData[yearKey]) {
          yearlyData[yearKey] = { make_to_stock: 0, make_to_order: 0 };
        }

        if (item.sales_order_pkid === null) {
          yearlyData[yearKey].make_to_stock += quantity;
        } else {
          yearlyData[yearKey].make_to_order += quantity;
        }
      },
    );

    const top5Yearly = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .map(([year, values]) => ({ year, ...values }));

    return top5Yearly;
  }

  async getInspectionProductType() {
    const response = await manufacturingIntegration.getInspectionProduct();
    const data = response.data.data;

    let good = 0;
    let defect = 0;

    data.forEach((item: { quantity_used: string; quantity_reject: string }) => {
      const quantityUsed = parseFloat(item.quantity_used);
      const quantityReject = parseFloat(item.quantity_reject);

      good += quantityUsed;
      defect += quantityReject;
    });

    const total = good + defect;
    return { good, defect, total };
  }

  async getInspectionProductByMonth() {
    const response = await manufacturingIntegration.getInspectionProduct();
    const data = response.data.data;

    const monthlyData: { [key: string]: { good: number; defect: number } } = {};
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
        quantity_used: string;
        quantity_reject: string;
        entry_date: string;
      }) => {
        const quantityUsed = parseFloat(item.quantity_used);
        const quantityReject = parseFloat(item.quantity_reject);
        const entryDate = new Date(item.entry_date);
        const monthKey = `${monthNames[entryDate.getMonth()]} ${entryDate.getFullYear()}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { good: 0, defect: 0 };
        }

        monthlyData[monthKey].good += quantityUsed;
        monthlyData[monthKey].defect += quantityReject;
      },
    );

    const top5Monthly = Object.entries(monthlyData)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5)
      .map(([month, values]) => ({ month, ...values }));

    return top5Monthly;
  }

  async getInspectionProductByYear() {
    const response = await manufacturingIntegration.getInspectionProduct();
    const data = response.data.data;

    const yearlyData: { [key: string]: { good: number; defect: number } } = {};

    data.forEach(
      (item: {
        quantity_used: string;
        quantity_reject: string;
        entry_date: string;
      }) => {
        const quantityUsed = parseFloat(item.quantity_used);
        const quantityReject = parseFloat(item.quantity_reject);
        const entryDate = new Date(item.entry_date);
        const yearKey = entryDate.getFullYear().toString();

        if (!yearlyData[yearKey]) {
          yearlyData[yearKey] = { good: 0, defect: 0 };
        }

        yearlyData[yearKey].good += quantityUsed;
        yearlyData[yearKey].defect += quantityReject;
      },
    );

    const top5Yearly = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .map(([year, values]) => ({ year, ...values }));

    return top5Yearly;
  }
}
