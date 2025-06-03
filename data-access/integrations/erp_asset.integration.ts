import { Request } from 'express';
import { erpAssetApi, erpAssetAPI } from '.';
import {
  ERPApiResponse,
  AssetItem,
  AssetDisposalItem,
  AssetMaintenanceItem,
  AssetStockTakeItem,
} from '../utility/interfaces';

// EXISTING functions (keep unchanged for backward compatibility)
export const getAsset = async () => {
  return erpAssetApi.get('/asset');
};

export const getAssetDisposal = async () => {
  return erpAssetApi.get('/asset_disposal/');
};

export const getMaintanedAsset = async () => {
  return erpAssetApi.get(`/asset_maintenance/ `);
};

export const getAssetStockTake = async () => {
  return erpAssetApi.get(`/asset_stock_take/`);
};

// NEW functions with auth support
export const getAssetWithAuth = (
  req: Request,
): Promise<{ data: ERPApiResponse<AssetItem> }> =>
  erpAssetAPI(req).get('/asset');

export const getAssetDisposalWithAuth = (
  req: Request,
): Promise<{ data: ERPApiResponse<AssetDisposalItem> }> =>
  erpAssetAPI(req).get('/asset_disposal/');

export const getMaintanedAssetWithAuth = (
  req: Request,
): Promise<{ data: ERPApiResponse<AssetMaintenanceItem> }> =>
  erpAssetAPI(req).get('/asset_maintenance/');

export const getAssetStockTakeWithAuth = (
  req: Request,
): Promise<{ data: ERPApiResponse<AssetStockTakeItem> }> =>
  erpAssetAPI(req).get('/asset_stock_take/');
