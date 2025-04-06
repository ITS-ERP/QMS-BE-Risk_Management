import { Request, Response } from 'express';
import { SRMProcurementService } from '../../business-layer/services/srm_procurement.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class SRMProcurementController extends BaseController {
  private srmProcurementService: SRMProcurementService;

  constructor() {
    super();
    this.srmProcurementService = new SRMProcurementService();
  }

  public async getAllSRMProcurementController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allSRMProcurement =
        await this.srmProcurementService.fetchAllSRMProcurement();
      return this.sendSuccessGet(
        req,
        res,
        allSRMProcurement,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getWinLoseCountController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const supplier_code = req.query.supplier_code as string;
      if (!supplier_code) {
        return res.status(400).json({ message: 'supplier_code is required' });
      }

      const winLoseCount =
        await this.srmProcurementService.getWinLoseCount(supplier_code);
      return this.sendSuccessGet(
        req,
        res,
        winLoseCount,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLoseCountController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const supplier_code = req.query.supplier_code as string;
      if (!supplier_code) {
        return res.status(400).json({ message: 'supplier_code is required' });
      }

      const loseCount =
        await this.srmProcurementService.getLoseCount(supplier_code);
      return this.sendSuccessGet(
        req,
        res,
        loseCount,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
