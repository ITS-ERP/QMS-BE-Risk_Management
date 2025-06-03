import { Request } from 'express';
import { getQMSContext } from '../../data-access/utility/requestHelper';
import {
  AssetItem,
  AssetDisposalItem,
  AssetMaintenanceItem,
  AssetStockTakeItem,
} from '../../data-access/utility/interfaces';
import * as assetIntegration from '../../data-access/integrations/erp_asset.integration';

export class AssetService {
  async fetchAsset(req: Request): Promise<AssetItem[]> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getAssetWithAuth(req);

    // Filter by tenant_id (jika null, tetap include untuk backward compatibility)
    const filteredData = response.data.data.filter(
      (item: AssetItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async fetchAssetDisposal(req: Request): Promise<AssetDisposalItem[]> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getAssetDisposalWithAuth(req);

    // Filter by tenant_id
    const filteredData = response.data.data.filter(
      (item: AssetDisposalItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async fetchMaintanedAsset(req: Request): Promise<AssetMaintenanceItem[]> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getMaintanedAssetWithAuth(req);

    // Filter by tenant_id
    const filteredData = response.data.data.filter(
      (item: AssetMaintenanceItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async fetchAssetStockTake(req: Request): Promise<AssetStockTakeItem[]> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getAssetStockTakeWithAuth(req);

    // Filter by tenant_id
    const filteredData = response.data.data.filter(
      (item: AssetStockTakeItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async getAssetType(
    req: Request,
  ): Promise<{ berwujud: number; tidak_berwujud: number; total: number }> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getAssetWithAuth(req);

    // Filter by tenant_id
    const assets = response.data.data.filter(
      (item: AssetItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    let tangibleCount = 0;
    let intangibleCount = 0;

    assets.forEach((asset: AssetItem) => {
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

  async getTotalAssetDisposal(
    req: Request,
  ): Promise<{ total_asset_disposal: number }> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getAssetDisposalWithAuth(req);

    // Filter by tenant_id
    const assets = response.data.data.filter(
      (item: AssetDisposalItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return { total_asset_disposal: assets.length };
  }

  async getTotalMaintanedAsset(
    req: Request,
  ): Promise<{ total_maintained_asset: number }> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getMaintanedAssetWithAuth(req);

    // Filter by tenant_id
    const assets = response.data.data.filter(
      (item: AssetMaintenanceItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return { total_maintained_asset: assets.length };
  }

  async getTotalAssetStockTake(
    req: Request,
  ): Promise<{ total_asset_stock_take: number }> {
    const context = getQMSContext(req);
    const response = await assetIntegration.getAssetStockTakeWithAuth(req);

    // Filter by tenant_id
    const assets = response.data.data.filter(
      (item: AssetStockTakeItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return { total_asset_stock_take: assets.length };
  }
}
