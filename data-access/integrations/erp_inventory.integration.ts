import { Request } from 'express';
import { erpInventoryApi, erpInventoryAPI } from '.';
import {
  ERPApiResponse,
  ReceiveItem,
  TransferItem,
} from '../utility/interfaces';

// EXISTING functions (keep unchanged)
export const getAllReceive = () => erpInventoryApi.get(`/receive`);
export const getAllTransfer = () => erpInventoryApi.get(`/transfer`);

// NEW functions with auth support
export const getAllReceiveWithAuth = (
  req: Request,
): Promise<{ data: ERPApiResponse<ReceiveItem> }> =>
  erpInventoryAPI(req).get('/receive');

export const getAllTransferWithAuth = (
  req: Request,
): Promise<{ data: ERPApiResponse<TransferItem> }> =>
  erpInventoryAPI(req).get('/transfer');
