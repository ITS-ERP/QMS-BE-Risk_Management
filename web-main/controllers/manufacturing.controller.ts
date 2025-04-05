import { Request, Response } from 'express';
import { ManufacturingService } from '../../business-layer/services/manufacturing.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ManufacturingController extends BaseController {
  private manufacturingService: ManufacturingService;

  constructor() {
    super();
    this.manufacturingService = new ManufacturingService();
  }

  public async getAllProductionRequestHeaderController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allProductionRequestHeader =
        await this.manufacturingService.fetchProductionRequestHeader();
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
        await this.manufacturingService.getProductionType();
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
        await this.manufacturingService.getProductionByMonth();
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
        await this.manufacturingService.getProductionByYear();
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

  getAllInspectionProductController = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const allInspectionProduct =
        await this.manufacturingService.fetchInspectionProduct();
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
  };

  public async getInspectionProductTypeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const inspectionProductType =
        await this.manufacturingService.getInspectionProductType();
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
        await this.manufacturingService.getInspectionProductByMonth();
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

  public async getInspectionProductByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const inspectionProductByYear =
        await this.manufacturingService.getInspectionProductByYear();
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
}
