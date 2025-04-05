import * as assetIntegration from '../../data-access/integrations/erp_asset.integration';

export class AssetService {
  async fetchAsset() {
    const response = await assetIntegration.getAsset();
    return response.data.data;
  }

  async fetchAssetDisposal() {
    const response = await assetIntegration.getAssetDisposal();
    return response.data.data;
  }

  async fetchMaintanedAsset() {
    const response = await assetIntegration.getMaintanedAsset();
    return response.data.data;
  }

  async fetchAssetStockTake() {
    const response = await assetIntegration.getAssetStockTake();
    return response.data.data;
  }

  async getAssetType() {
    const response = await assetIntegration.getAsset();
    const assets = response.data.data;

    let tangibleCount = 0;
    let intangibleCount = 0;

    assets.forEach((asset: { type_of_asset: string }) => {
      if (asset.type_of_asset === 'berwujud') {
        tangibleCount++;
      } else if (asset.type_of_asset === 'tidak berwujud') {
        intangibleCount++;
      }
    });

    const totalCount = tangibleCount + intangibleCount;
    return {
      berwujud: tangibleCount,
      tidak_berwujud: intangibleCount,
      total: totalCount,
    };
  }

  async getTotalAssetDisposal() {
    const response = await assetIntegration.getAssetDisposal();
    const assets = response.data.data;
    return { total_asset_disposal: assets.length };
  }

  async getTotalMaintanedAsset() {
    const response = await assetIntegration.getMaintanedAsset();
    const assets = response.data.data;
    return { total_maintained_asset: assets.length };
  }

  async getTotalAssetStockTake() {
    const response = await assetIntegration.getAssetStockTake();
    const assets = response.data.data;
    return { total_asset_stock_take: assets.length };
  }
}
