import { Op } from 'sequelize';
import {
  Receive,
  ReceiveDetail,
  Transfer,
  TransferDetail,
} from '../../rabbit/external/erpInventoryDB';
import {
  ProductionRequest,
  InspectionProduct,
} from '../../rabbit/external/erpManufacturingDB';

export interface ERPReceiveData {
  pkid: number;
  code: string;
  warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  received_date: Date;
  status: string;
  type: string;
  total_quantity: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  is_rejected: boolean;
  description?: string;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
  receiveDetails?: ERPReceiveDetailData[];
}

export interface ERPReceiveDetailData {
  pkid: number;
  receive_pkid: number;
  item_pkid: number;
  item_quantity: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export interface ERPTransferData {
  pkid: number;
  code: string;
  from_warehouse_pkid?: number;
  to_warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  transfer_date: Date;
  status: string;
  type: string;
  total_quantity: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  description?: string;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
  transferDetails?: ERPTransferDetailData[];
}

export interface ERPTransferDetailData {
  pkid: number;
  transfer_pkid: number;
  item_pkid: number;
  item_quantity: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export interface ERPProductionRequestData {
  pkid: number;
  warehouse_pkid: number;
  item_pkid: number;
  sales_order_pkid?: number;
  code: string;
  start_date: Date;
  end_date: Date;
  quantity: number;
  status: string;
  description?: string;
  is_active: boolean;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export interface ERPInspectionProductData {
  pkid: number;
  receive_product_pkid?: number;
  production_order_pkid?: number;
  warehouse_pkid: number;
  item_pkid?: number;
  code: string;
  entry_date: Date;
  quantity: number;
  quantity_reject: number;
  quantity_used: number;
  result: string;
  status: string;
  description?: string;
  is_active: boolean;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export const fallbackGetReceivesFromERPInventoryDB = async (
  tenant_id: number,
): Promise<ERPReceiveData[]> => {
  try {
    console.log(
      `🔄 [Fallback ERP Receives] Querying ERP Inventory DB for tenant ${tenant_id}`,
    );

    const receives = (await Receive.findAll({
      include: [
        {
          model: ReceiveDetail,
          as: 'receiveDetails',
          required: false,
          where: {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        },
      ],
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ tenant_id: tenant_id }, { tenant_id: null }],
          },
          {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        ],
      },
      raw: false,
      order: [['created_date', 'DESC']],
    })) as unknown as any[];

    const receiveData = receives.map((receive) => {
      return receive.toJSON() as ERPReceiveData;
    });

    console.log(
      `✅ [Fallback ERP Receives] Found ${receiveData.length} receives from ERP Inventory DB`,
    );

    return receiveData;
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Receives] Error fetching receives from ERP Inventory DB:',
      error,
    );
    throw error;
  }
};

export const fallbackGetTransfersFromERPInventoryDB = async (
  tenant_id: number,
): Promise<ERPTransferData[]> => {
  try {
    console.log(
      `🔄 [Fallback ERP Transfers] Querying ERP Inventory DB for tenant ${tenant_id}`,
    );

    const transfers = (await Transfer.findAll({
      include: [
        {
          model: TransferDetail,
          as: 'transferDetails',
          required: false,
          where: {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        },
      ],
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ tenant_id: tenant_id }, { tenant_id: null }],
          },
          {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        ],
      },
      raw: false,
      order: [['created_date', 'DESC']],
    })) as unknown as any[];

    const transferData = transfers.map((transfer) => {
      return transfer.toJSON() as ERPTransferData;
    });

    console.log(
      `✅ [Fallback ERP Transfers] Found ${transferData.length} transfers from ERP Inventory DB`,
    );

    return transferData;
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Transfers] Error fetching transfers from ERP Inventory DB:',
      error,
    );
    throw error;
  }
};

export const fallbackGetProductionRequestsFromERPManufacturingDB = async (
  tenant_id: number,
): Promise<ERPProductionRequestData[]> => {
  try {
    console.log(
      `🔄 [Fallback ERP Production Requests] Querying ERP Manufacturing DB for tenant ${tenant_id}`,
    );

    const productionRequests = (await ProductionRequest.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ tenant_id: tenant_id }, { tenant_id: null }],
          },
          {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        ],
      },
      raw: true,
      order: [['created_date', 'DESC']],
    })) as unknown as ERPProductionRequestData[];

    console.log(
      `✅ [Fallback ERP Production Requests] Found ${productionRequests.length} production requests from ERP Manufacturing DB`,
    );

    return productionRequests;
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Production Requests] Error fetching production requests from ERP Manufacturing DB:',
      error,
    );
    throw error;
  }
};

export const fallbackGetInspectionProductsFromERPManufacturingDB = async (
  tenant_id: number,
): Promise<ERPInspectionProductData[]> => {
  try {
    console.log(
      `🔄 [Fallback ERP Inspection Products] Querying ERP Manufacturing DB for tenant ${tenant_id}`,
    );

    const inspectionProducts = (await InspectionProduct.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ tenant_id: tenant_id }, { tenant_id: null }],
          },
          {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        ],
      },
      raw: true,
      order: [['created_date', 'DESC']],
    })) as unknown as ERPInspectionProductData[];

    console.log(
      `✅ [Fallback ERP Inspection Products] Found ${inspectionProducts.length} inspection products from ERP Manufacturing DB`,
    );

    return inspectionProducts;
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Inspection Products] Error fetching inspection products from ERP Manufacturing DB:',
      error,
    );
    throw error;
  }
};

export const fallbackGetReceivesByDateRangeFromERPInventoryDB = async (
  tenant_id: number,
  start_date: Date,
  end_date: Date,
): Promise<ERPReceiveData[]> => {
  try {
    console.log(
      `🔄 [Fallback ERP Receives] Querying ERP Inventory DB for tenant ${tenant_id} between ${start_date.toISOString()} and ${end_date.toISOString()}`,
    );

    const receives = (await Receive.findAll({
      include: [
        {
          model: ReceiveDetail,
          as: 'receiveDetails',
          required: false,
          where: {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        },
      ],
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ tenant_id: tenant_id }, { tenant_id: null }],
          },
          {
            received_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        ],
      },
      raw: false,
      order: [['received_date', 'DESC']],
    })) as unknown as any[];

    const receiveData = receives.map((receive) => {
      return receive.toJSON() as ERPReceiveData;
    });

    console.log(
      `✅ [Fallback ERP Receives] Found ${receiveData.length} receives for date range`,
    );

    return receiveData;
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Receives] Error fetching receives by date range:',
      error,
    );
    throw error;
  }
};

export const fallbackGetTransfersByDateRangeFromERPInventoryDB = async (
  tenant_id: number,
  start_date: Date,
  end_date: Date,
): Promise<ERPTransferData[]> => {
  try {
    console.log(
      `🔄 [Fallback ERP Transfers] Querying ERP Inventory DB for tenant ${tenant_id} between ${start_date.toISOString()} and ${end_date.toISOString()}`,
    );

    const transfers = (await Transfer.findAll({
      include: [
        {
          model: TransferDetail,
          as: 'transferDetails',
          required: false,
          where: {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        },
      ],
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ tenant_id: tenant_id }, { tenant_id: null }],
          },
          {
            transfer_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        ],
      },
      raw: false,
      order: [['transfer_date', 'DESC']],
    })) as unknown as any[];

    const transferData = transfers.map((transfer) => {
      return transfer.toJSON() as ERPTransferData;
    });

    console.log(
      `✅ [Fallback ERP Transfers] Found ${transferData.length} transfers for date range`,
    );

    return transferData;
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Transfers] Error fetching transfers by date range:',
      error,
    );
    throw error;
  }
};

export const fallbackTestERPConnections = async () => {
  try {
    console.log(`🔍 [Fallback Test] Testing ERP database connections...`);
    const receiveTest = (await Receive.findOne({
      limit: 1,
      raw: true,
    })) as unknown as ERPReceiveData | null;
    console.log(
      `✅ [Fallback Test] ERP Inventory DB connection: ${receiveTest ? 'SUCCESS' : 'EMPTY TABLE'}`,
    );

    const transferTest = (await Transfer.findOne({
      limit: 1,
      raw: true,
    })) as unknown as ERPTransferData | null;
    console.log(
      `✅ [Fallback Test] ERP Transfer DB connection: ${transferTest ? 'SUCCESS' : 'EMPTY TABLE'}`,
    );
    const productionRequestTest = (await ProductionRequest.findOne({
      limit: 1,
      raw: true,
    })) as unknown as ERPProductionRequestData | null;
    console.log(
      `✅ [Fallback Test] ERP Manufacturing Production Request DB connection: ${productionRequestTest ? 'SUCCESS' : 'EMPTY TABLE'}`,
    );

    const inspectionProductTest = (await InspectionProduct.findOne({
      limit: 1,
      raw: true,
    })) as unknown as ERPInspectionProductData | null;
    console.log(
      `✅ [Fallback Test] ERP Manufacturing Inspection Product DB connection: ${inspectionProductTest ? 'SUCCESS' : 'EMPTY TABLE'}`,
    );

    return {
      inventoryReceiveDB: receiveTest !== null,
      inventoryTransferDB: transferTest !== null,
      manufacturingProductionRequestDB: productionRequestTest !== null,
      manufacturingInspectionProductDB: inspectionProductTest !== null,
      status: 'connections_verified',
    };
  } catch (error) {
    console.error(
      `❌ [Fallback Test] ERP Database connection test failed:`,
      error,
    );
    throw error;
  }
};

export const fallbackGetReceiveStatsByTenant = async (
  tenant_id: number,
): Promise<{
  total_receives: number;
  total_accepted: number;
  total_rejected: number;
  acceptance_rate: number;
  rejection_rate: number;
}> => {
  try {
    const receives = await fallbackGetReceivesFromERPInventoryDB(tenant_id);

    let totalAccepted = 0;
    let totalRejected = 0;
    let totalReceives = receives.length;

    receives.forEach((receive) => {
      if (receive.receiveDetails) {
        receive.receiveDetails.forEach((detail) => {
          totalAccepted += detail.item_accepted_quantity || 0;
          totalRejected += detail.item_rejected_quantity || 0;
        });
      }
    });

    const totalQuantity = totalAccepted + totalRejected;

    return {
      total_receives: totalReceives,
      total_accepted: totalAccepted,
      total_rejected: totalRejected,
      acceptance_rate:
        totalQuantity > 0 ? (totalAccepted / totalQuantity) * 100 : 0,
      rejection_rate:
        totalQuantity > 0 ? (totalRejected / totalQuantity) * 100 : 0,
    };
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Stats] Error calculating receive statistics:',
      error,
    );
    throw error;
  }
};

export const fallbackGetTransferStatsByTenant = async (
  tenant_id: number,
): Promise<{
  total_transfers: number;
  total_accepted: number;
  total_rejected: number;
  acceptance_rate: number;
  rejection_rate: number;
}> => {
  try {
    const transfers = await fallbackGetTransfersFromERPInventoryDB(tenant_id);

    let totalAccepted = 0;
    let totalRejected = 0;
    let totalTransfers = transfers.length;

    transfers.forEach((transfer) => {
      if (transfer.transferDetails) {
        transfer.transferDetails.forEach((detail) => {
          totalAccepted += detail.item_accepted_quantity || 0;
          totalRejected += detail.item_rejected_quantity || 0;
        });
      }
    });

    const totalQuantity = totalAccepted + totalRejected;

    return {
      total_transfers: totalTransfers,
      total_accepted: totalAccepted,
      total_rejected: totalRejected,
      acceptance_rate:
        totalQuantity > 0 ? (totalAccepted / totalQuantity) * 100 : 0,
      rejection_rate:
        totalQuantity > 0 ? (totalRejected / totalQuantity) * 100 : 0,
    };
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Stats] Error calculating transfer statistics:',
      error,
    );
    throw error;
  }
};

export const fallbackGetInspectionProductStatsByTenant = async (
  tenant_id: number,
): Promise<{
  total_inspections: number;
  total_good: number;
  total_defect: number;
  good_rate: number;
  defect_rate: number;
}> => {
  try {
    const inspectionProducts =
      await fallbackGetInspectionProductsFromERPManufacturingDB(tenant_id);

    let totalGood = 0;
    let totalDefect = 0;
    let totalInspections = inspectionProducts.length;

    inspectionProducts.forEach((inspection) => {
      totalGood += inspection.quantity_used || 0;
      totalDefect += inspection.quantity_reject || 0;
    });

    const totalQuantity = totalGood + totalDefect;

    return {
      total_inspections: totalInspections,
      total_good: totalGood,
      total_defect: totalDefect,
      good_rate: totalQuantity > 0 ? (totalGood / totalQuantity) * 100 : 0,
      defect_rate: totalQuantity > 0 ? (totalDefect / totalQuantity) * 100 : 0,
    };
  } catch (error) {
    console.error(
      '❌ [Fallback ERP Stats] Error calculating inspection product statistics:',
      error,
    );
    throw error;
  }
};
