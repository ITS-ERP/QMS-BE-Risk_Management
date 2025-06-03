import { Request, Response } from 'express';
import { InventoryService } from '../../business-layer/services/erp_inventory.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class InventoryController extends BaseController {
  private inventoryService: InventoryService;

  constructor() {
    super();
    this.inventoryService = new InventoryService();
  }

  // RECEIVE CONTROLLERS
  public async getAllReceiveController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allReceive = await this.inventoryService.fetchAllReceive(req);
      return this.sendSuccessGet(
        req,
        res,
        allReceive,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getReceiveTypeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receiveType = await this.inventoryService.getReceiveType(req);
      return this.sendSuccessGet(
        req,
        res,
        receiveType,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getReceiveByMonthController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receiveByMonth = await this.inventoryService.getReceiveByMonth(req);
      return this.sendSuccessGet(
        req,
        res,
        receiveByMonth,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllReceiveByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receiveByYear =
        await this.inventoryService.getAllReceiveByYear(req);
      return this.sendSuccessGet(
        req,
        res,
        receiveByYear,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getReceiveSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receiveSummary = await this.inventoryService.getReceiveSummary(req);
      return this.sendSuccessGet(
        req,
        res,
        receiveSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getRejectReceiveByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const rejectReceiveByYear =
        await this.inventoryService.getRejectReceiveByYear(req);
      return this.sendSuccessGet(
        req,
        res,
        rejectReceiveByYear,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // TRANSFER CONTROLLERS
  public async getAllTransferController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allTransfer = await this.inventoryService.fetchAllTransfer(req);
      return this.sendSuccessGet(
        req,
        res,
        allTransfer,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTransferTypeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const transferType = await this.inventoryService.getTransferType(req);
      return this.sendSuccessGet(
        req,
        res,
        transferType,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllTransferByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const transferByYear =
        await this.inventoryService.getAllTransferByYear(req);
      return this.sendSuccessGet(
        req,
        res,
        transferByYear,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTransferSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const transferSummary =
        await this.inventoryService.getTransferSummary(req);
      return this.sendSuccessGet(
        req,
        res,
        transferSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getRejectTransferByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const rejectTransferByYear =
        await this.inventoryService.getRejectTransferByYear(req);
      return this.sendSuccessGet(
        req,
        res,
        rejectTransferByYear,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // RISK ANALYSIS CONTROLLERS
  public async getReceiveRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receiveRiskRateTrend =
        await this.inventoryService.getReceiveRiskRateTrend(req);
      return this.sendSuccessGet(
        req,
        res,
        receiveRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTransferRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const transferRiskRateTrend =
        await this.inventoryService.getTransferRiskRateTrend(req);
      return this.sendSuccessGet(
        req,
        res,
        transferRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
