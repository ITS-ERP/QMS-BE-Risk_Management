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

  public async getReceiveByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receiveByYear = await this.inventoryService.getReceiveByYear();
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

  public async getTransferByYearController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const transferByYear = await this.inventoryService.getTransferByYear();
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
}
