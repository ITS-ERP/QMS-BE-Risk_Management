import { Request, Response } from 'express';
import { CRMContractService } from '../../business-layer/services/crm_contract.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class CRMContractController extends BaseController {
  private crmContractService: CRMContractService;

  constructor() {
    super();
    this.crmContractService = new CRMContractService();
  }

  public async getAllCRMContractController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allCRMContract =
        await this.crmContractService.fetchAllCRMContract();
      return this.sendSuccessGet(
        req,
        res,
        allCRMContract,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
