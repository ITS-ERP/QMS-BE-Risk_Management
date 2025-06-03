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
      const allProductionRequestHeader =
        await this.manufacturingService.fetchProductionRequestHeader(req);
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
      const productionType =
        await this.manufacturingService.getProductionType(req);
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
      const productionByMonth =
        await this.manufacturingService.getProductionByMonth(req);
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
      const productionByYear =
        await this.manufacturingService.getProductionByYear(req);
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
      const allInspectionProduct =
        await this.manufacturingService.fetchInspectionProduct(req);
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
      const inspectionProductType =
        await this.manufacturingService.getInspectionProductType(req);
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
      const inspectionProductByMonth =
        await this.manufacturingService.getInspectionProductByMonth(req);
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
      const inspectionProductByYear =
        await this.manufacturingService.getAllInspectionProductByYear(req);
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
      const inspectionProductSummary =
        await this.manufacturingService.getInspectionProductSummary(req);
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
      const defectInspectionProductByYear =
        await this.manufacturingService.getDefectInspectionProductByYear(req);
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
      const defectRiskRateTrend =
        await this.manufacturingService.getDefectRiskRateTrend(req);
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
