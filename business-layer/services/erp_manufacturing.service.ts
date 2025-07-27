import { Request } from 'express';
import { getQMSContext } from '../../data-access/utility/requestHelper';
import {
  ProductionRequestItem,
  InspectionProductItem,
} from '../../data-access/utility/interfaces';
import {
  getProductionRequestsViaRPC,
  getInspectionProductsViaRPC,
} from '../../rabbit/requestERPData';

export class ManufacturingService {
  // ================================
  // PRODUCTION REQUEST METHODS
  // ================================

  /**
   * 🎯 UPDATED: Fetch production requests menggunakan RabbitMQ
   */
  async fetchProductionRequestHeader(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<ProductionRequestItem[]> {
    const context = getQMSContext(req);

    // 🎯 USE RABBITMQ INSTEAD OF DIRECT API
    const response = (await getProductionRequestsViaRPC(
      req,
      context.tenant_id_number,
    )) as ProductionRequestItem[];

    // Filter berdasarkan tenant_id - prioritas industry_tenant_id jika ada, fallback ke context
    const targetTenantId = industry_tenant_id || context.tenant_id_number;
    const filteredData = response.filter(
      (item: ProductionRequestItem) =>
        item.tenant_id === targetTenantId || item.tenant_id === null,
    );

    return filteredData;
  }

  /**
   * 🎯 UPDATED: Fetch inspection products menggunakan RabbitMQ
   */
  async fetchInspectionProduct(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<InspectionProductItem[]> {
    const context = getQMSContext(req);

    // 🎯 USE RABBITMQ INSTEAD OF DIRECT API
    const response = (await getInspectionProductsViaRPC(
      req,
      context.tenant_id_number,
    )) as InspectionProductItem[];

    // Filter berdasarkan tenant_id - prioritas industry_tenant_id jika ada, fallback ke context
    const targetTenantId = industry_tenant_id || context.tenant_id_number;
    const filteredData = response.filter(
      (item: InspectionProductItem) =>
        item.tenant_id === targetTenantId || item.tenant_id === null,
    );

    return filteredData;
  }

  async getProductionType(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<{ make_to_stock: number; make_to_order: number; total: number }> {
    const data = await this.fetchProductionRequestHeader(
      req,
      industry_tenant_id,
    );

    let make_to_stock = 0;
    let make_to_order = 0;

    data.forEach((item: ProductionRequestItem) => {
      const quantity = parseFloat(item.quantity);
      if (item.sales_order_pkid === null) {
        make_to_stock += quantity;
      } else {
        make_to_order += quantity;
      }
    });

    const total = make_to_stock + make_to_order;
    return { make_to_stock, make_to_order, total };
  }

  async getProductionByMonth(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<
    Array<{ month: string; make_to_stock: number; make_to_order: number }>
  > {
    const data = await this.fetchProductionRequestHeader(
      req,
      industry_tenant_id,
    );

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

    data.forEach((item: ProductionRequestItem) => {
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
    });

    const top5Monthly = Object.entries(monthlyData)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5)
      .reverse()
      .map(([month, values]) => ({ month, ...values }));

    return top5Monthly;
  }

  async getProductionByYear(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<
    Array<{ year: string; make_to_stock: number; make_to_order: number }>
  > {
    const data = await this.fetchProductionRequestHeader(
      req,
      industry_tenant_id,
    );

    const yearlyData: {
      [key: string]: { make_to_stock: number; make_to_order: number };
    } = {};

    data.forEach((item: ProductionRequestItem) => {
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
    });

    const allYearlyData = Object.entries(yearlyData)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .slice(0, 5)
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyData;
  }

  // ================================
  // INSPECTION PRODUCT METHODS
  // ================================

  async getInspectionProductType(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<{ good: number; defect: number; total: number }> {
    const data = await this.fetchInspectionProduct(req, industry_tenant_id);

    let good = 0;
    let defect = 0;

    data.forEach((item: InspectionProductItem) => {
      const quantityUsed = parseFloat(item.quantity_used);
      const quantityReject = parseFloat(item.quantity_reject);
      good += quantityUsed;
      defect += quantityReject;
    });

    const total = good + defect;
    return { good, defect, total };
  }

  async getInspectionProductByMonth(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ month: string; good: number; defect: number }>> {
    const data = await this.fetchInspectionProduct(req, industry_tenant_id);

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

    data.forEach((item: InspectionProductItem) => {
      const quantityUsed = parseFloat(item.quantity_used);
      const quantityReject = parseFloat(item.quantity_reject);
      const entryDate = new Date(item.entry_date);
      const monthKey = `${monthNames[entryDate.getMonth()]} ${entryDate.getFullYear()}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { good: 0, defect: 0 };
      }

      monthlyData[monthKey].good += quantityUsed;
      monthlyData[monthKey].defect += quantityReject;
    });

    const top5Monthly = Object.entries(monthlyData)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5)
      .reverse()
      .map(([month, values]) => ({ month, ...values }));

    return top5Monthly;
  }

  async getAllInspectionProductByYear(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; good: number; defect: number }>> {
    const data = await this.fetchInspectionProduct(req, industry_tenant_id);

    const yearlyData: { [key: string]: { good: number; defect: number } } = {};

    data.forEach((item: InspectionProductItem) => {
      const quantityUsed = parseFloat(item.quantity_used);
      const quantityReject = parseFloat(item.quantity_reject);
      const entryDate = new Date(item.entry_date);
      const yearKey = entryDate.getFullYear().toString();

      if (!yearlyData[yearKey]) {
        yearlyData[yearKey] = { good: 0, defect: 0 };
      }

      yearlyData[yearKey].good += quantityUsed;
      yearlyData[yearKey].defect += quantityReject;
    });

    const allYearlyData = Object.entries(yearlyData)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, values]) => ({ year, ...values }));

    return allYearlyData;
  }

  async getInspectionProductSummary(req: Request, industry_tenant_id?: number) {
    const allYearlyData = await this.getAllInspectionProductByYear(
      req,
      industry_tenant_id,
    );

    let totalGood = 0;
    let totalDefect = 0;

    allYearlyData.forEach(({ good, defect }) => {
      totalGood += good;
      totalDefect += defect;
    });

    const totalQuantity = totalGood + totalDefect;

    return {
      total_quantity: totalQuantity > 0 ? totalQuantity : 0,
      total_good: totalGood > 0 ? totalGood : 0,
      total_defect: totalDefect > 0 ? totalDefect : 0,
      good_rate:
        totalQuantity > 0
          ? parseFloat(((totalGood / totalQuantity) * 100).toFixed(2))
          : 0.0,
      defect_rate:
        totalQuantity > 0
          ? parseFloat(((totalDefect / totalQuantity) * 100).toFixed(2))
          : 0.0,
    };
  }

  async getDefectInspectionProductByYear(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; defect: number }>> {
    const data = await this.fetchInspectionProduct(req, industry_tenant_id);

    const yearlyData: { [key: string]: { defect: number } } = {};

    data.forEach((item: InspectionProductItem) => {
      const quantityReject = parseFloat(item.quantity_reject);
      const entryDate = new Date(item.entry_date);
      const yearKey = entryDate.getFullYear().toString();

      if (!yearlyData[yearKey]) {
        yearlyData[yearKey] = { defect: 0 };
      }

      yearlyData[yearKey].defect += quantityReject;
    });

    const top5Yearly = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5)
      .reverse()
      .map(([year, values]) => ({ year, ...values }));

    return top5Yearly;
  }

  // ================================
  // RISK ANALYSIS METHODS
  // ================================

  /**
   * Risk Rate Trend untuk Defect (Produk Cacat)
   */
  async getDefectRiskRateTrend(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ year: string; value: number }>> {
    const yearlyData = await this.getAllInspectionProductByYear(
      req,
      industry_tenant_id,
    );

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.good + item.defect;
      const riskRate =
        total > 0 ? parseFloat(((item.defect / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }

  // ================================
  // ADDITIONAL ANALYTICS METHODS
  // ================================

  async getProductionByStatus(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ status: string; count: number; total_quantity: number }>> {
    const data = await this.fetchProductionRequestHeader(
      req,
      industry_tenant_id,
    );

    const statusData: {
      [key: string]: { count: number; total_quantity: number };
    } = {};

    data.forEach((item: ProductionRequestItem) => {
      const status = item.status;
      const quantity = parseFloat(item.quantity);

      if (!statusData[status]) {
        statusData[status] = { count: 0, total_quantity: 0 };
      }

      statusData[status].count += 1;
      statusData[status].total_quantity += quantity;
    });

    return Object.entries(statusData)
      .map(([status, values]) => ({ status, ...values }))
      .sort((a, b) => b.total_quantity - a.total_quantity);
  }

  async getInspectionByResult(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<Array<{ result: string; count: number; total_quantity: number }>> {
    const data = await this.fetchInspectionProduct(req, industry_tenant_id);

    const resultData: {
      [key: string]: { count: number; total_quantity: number };
    } = {};

    data.forEach((item: InspectionProductItem) => {
      const result = item.result;
      const quantity = parseFloat(item.quantity);

      if (!resultData[result]) {
        resultData[result] = { count: 0, total_quantity: 0 };
      }

      resultData[result].count += 1;
      resultData[result].total_quantity += quantity;
    });

    return Object.entries(resultData)
      .map(([result, values]) => ({ result, ...values }))
      .sort((a, b) => b.total_quantity - a.total_quantity);
  }
}
