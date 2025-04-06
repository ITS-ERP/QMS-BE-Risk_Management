import { Request, Response } from 'express';
import { SRMContractService } from '../../business-layer/services/srm_contract.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class SRMContractController extends BaseController {
  private srmContractService: SRMContractService;

  constructor() {
    super();
    this.srmContractService = new SRMContractService();
  }

  public async getAllSRMContractController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allSRMContract =
        await this.srmContractService.fetchAllSRMContract();
      return this.sendSuccessGet(
        req,
        res,
        allSRMContract,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
