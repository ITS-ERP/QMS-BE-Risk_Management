import { erpAssetApi } from '.';

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
