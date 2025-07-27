import { Request, Response } from 'express';
import { AssetService } from '../../business-layer/services/erp_asset.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class AssetController extends BaseController {
  private assetService: AssetService;

  constructor() {
    super();
    this.assetService = new AssetService();
  }

  public async getAssetController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const asset = await this.assetService.fetchAsset(req, industry_tenant_id);
      return this.sendSuccessGet(req, res, asset, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAssetDisposalController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const assetDisposal = await this.assetService.fetchAssetDisposal(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(
        req,
        res,
        assetDisposal,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getMaintanedAssetController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const maintanedAsset = await this.assetService.fetchMaintanedAsset(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(
        req,
        res,
        maintanedAsset,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAssetStockTakeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const assetStockTake = await this.assetService.fetchAssetStockTake(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(
        req,
        res,
        assetStockTake,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAssetTypeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const assetTypes = await this.assetService.getAssetType(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(
        req,
        res,
        assetTypes,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTotalAssetDisposalController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const result = await this.assetService.getTotalAssetDisposal(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(req, res, result, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      console.error('Error in getTotalAssetDisposalController:', error);
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTotalMaintanedAssetController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const result = await this.assetService.getTotalMaintanedAsset(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(req, res, result, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      console.error('Error in getTotalMaintanedAssetController:', error);
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTotalAssetStockTakeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const result = await this.assetService.getTotalAssetStockTake(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(req, res, result, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      console.error('Error in getTotalAssetStockTakeController:', error);
      return this.handleError(req, res, error, 500);
    }
  }
}
