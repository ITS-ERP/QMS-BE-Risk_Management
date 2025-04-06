import { Request, Response } from 'express';
import { CRMRequisitionService } from '../../business-layer/services/crm_requisition.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class CRMRequisitionController extends BaseController {
  private crmRequisitionService: CRMRequisitionService;

  constructor() {
    super();
    this.crmRequisitionService = new CRMRequisitionService();
  }

  public async getAllCRMLoRController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allCRMLoR = await this.crmRequisitionService.fetchAllCRMLoR();
      return this.sendSuccessGet(
        req,
        res,
        allCRMLoR,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllCRMLoAController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allCRMLoA = await this.crmRequisitionService.fetchAllCRMLoA();
      return this.sendSuccessGet(
        req,
        res,
        allCRMLoA,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
