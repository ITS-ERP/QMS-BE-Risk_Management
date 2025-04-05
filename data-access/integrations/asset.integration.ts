import { assetApi } from '.';

export const getAsset = async () => {
  return assetApi.get('/asset');
};

export const getAssetDisposal = async () => {
  return assetApi.get('/asset_disposal/');
};

export const getMaintanedAsset = async () => {
  return assetApi.get(`/asset_maintenance/ `);
};

export const getAssetStockTake = async () => {
  return assetApi.get(`/asset_stock_take/`);
};
