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

  public async getAllReceiveController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allReceive = await this.inventoryService.fetchAllReceive();
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

  getAllTransferController = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const allTransfer = await this.inventoryService.fetchAllTransfer();
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
  };

  public async getReceiveTypeController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receiveType = await this.inventoryService.getReceiveType();
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
      const receiveByMonth = await this.inventoryService.getReceiveByMonth();
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
      const receiveByYear = await this.inventoryService.getAllReceiveByYear();
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
      const receiveSummary = await this.inventoryService.getReceiveSummary();
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
      const rejectreceiveByYear =
        await this.inventoryService.getRejectReceiveByYear();
      return this.sendSuccessGet(
        req,
        res,
        rejectreceiveByYear,
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
      const transferByYear = await this.inventoryService.getAllTransferByYear();
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
      const transferSummary = await this.inventoryService.getTransferSummary();
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
        await this.inventoryService.getRejectTransferByYear();
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
}
