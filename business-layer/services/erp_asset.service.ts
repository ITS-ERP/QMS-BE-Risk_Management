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
  async fetchAsset(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<AssetItem[]> {
    const response = await assetIntegration.getAssetWithAuth(req);
    if (industry_tenant_id !== undefined) {
      const filteredData = response.data.data.filter(
        (item: AssetItem) =>
          item.tenant_id === industry_tenant_id || item.tenant_id === null,
      );
      return filteredData;
    }
    const context = getQMSContext(req);
    const filteredData = response.data.data.filter(
      (item: AssetItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async fetchAssetDisposal(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<AssetDisposalItem[]> {
    const response = await assetIntegration.getAssetDisposalWithAuth(req);
    if (industry_tenant_id !== undefined) {
      const filteredData = response.data.data.filter(
        (item: AssetDisposalItem) =>
          item.tenant_id === industry_tenant_id || item.tenant_id === null,
      );
      return filteredData;
    }
    const context = getQMSContext(req);
    const filteredData = response.data.data.filter(
      (item: AssetDisposalItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async fetchMaintanedAsset(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<AssetMaintenanceItem[]> {
    const response = await assetIntegration.getMaintanedAssetWithAuth(req);
    if (industry_tenant_id !== undefined) {
      const filteredData = response.data.data.filter(
        (item: AssetMaintenanceItem) =>
          item.tenant_id === industry_tenant_id || item.tenant_id === null,
      );
      return filteredData;
    }
    const context = getQMSContext(req);
    const filteredData = response.data.data.filter(
      (item: AssetMaintenanceItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async fetchAssetStockTake(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<AssetStockTakeItem[]> {
    const response = await assetIntegration.getAssetStockTakeWithAuth(req);
    if (industry_tenant_id !== undefined) {
      const filteredData = response.data.data.filter(
        (item: AssetStockTakeItem) =>
          item.tenant_id === industry_tenant_id || item.tenant_id === null,
      );
      return filteredData;
    }
    const context = getQMSContext(req);
    const filteredData = response.data.data.filter(
      (item: AssetStockTakeItem) =>
        item.tenant_id === context.tenant_id_number || item.tenant_id === null,
    );

    return filteredData;
  }

  async getAssetType(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<{ berwujud: number; tidak_berwujud: number; total: number }> {
    const assets = await this.fetchAsset(req, industry_tenant_id);

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
    industry_tenant_id?: number,
  ): Promise<{ total_asset_disposal: number }> {
    const assets = await this.fetchAssetDisposal(req, industry_tenant_id);
    return { total_asset_disposal: assets.length };
  }

  async getTotalMaintanedAsset(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<{ total_maintained_asset: number }> {
    const assets = await this.fetchMaintanedAsset(req, industry_tenant_id);
    return { total_maintained_asset: assets.length };
  }

  async getTotalAssetStockTake(
    req: Request,
    industry_tenant_id?: number,
  ): Promise<{ total_asset_stock_take: number }> {
    const assets = await this.fetchAssetStockTake(req, industry_tenant_id);
    return { total_asset_stock_take: assets.length };
  }
}
