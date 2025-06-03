import { Request, Response } from 'express';
import { ManufacturingService } from '../../business-layer/services/erp_manufacturing.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ManufacturingController extends BaseController {
  private manufacturingService: ManufacturingService;

  constructor() {
    super();
    this.manufacturingService = new ManufacturingService();
  }

  // PRODUCTION REQUEST CONTROLLERS
  public async getAllProductionRequestHeaderController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const allProductionRequestHeader =
        await this.manufacturingService.fetchProductionRequestHeader(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        allProductionRequestHeader,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getProductionTypeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const productionType = await this.manufacturingService.getProductionType(
        req,
        industry_tenant_id,
      );
      return this.sendSuccessGet(
        req,
        res,
        productionType,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getProductionByMonthController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const productionByMonth =
        await this.manufacturingService.getProductionByMonth(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        productionByMonth,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getProductionByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const productionByYear =
        await this.manufacturingService.getProductionByYear(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        productionByYear,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // INSPECTION PRODUCT CONTROLLERS
  public async getAllInspectionProductController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const allInspectionProduct =
        await this.manufacturingService.fetchInspectionProduct(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        allInspectionProduct,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getInspectionProductTypeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const inspectionProductType =
        await this.manufacturingService.getInspectionProductType(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        inspectionProductType,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getInspectionProductByMonthController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const inspectionProductByMonth =
        await this.manufacturingService.getInspectionProductByMonth(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        inspectionProductByMonth,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllInspectionProductByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const inspectionProductByYear =
        await this.manufacturingService.getAllInspectionProductByYear(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        inspectionProductByYear,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getInspectionProductSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const inspectionProductSummary =
        await this.manufacturingService.getInspectionProductSummary(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        inspectionProductSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getDefectInspectionProductByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const defectInspectionProductByYear =
        await this.manufacturingService.getDefectInspectionProductByYear(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        defectInspectionProductByYear,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // RISK ANALYSIS CONTROLLER
  public async getDefectRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;

      // Validate parameter
      if (req.query.industry_tenant_id && isNaN(industry_tenant_id!)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const defectRiskRateTrend =
        await this.manufacturingService.getDefectRiskRateTrend(
          req,
          industry_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        defectRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
