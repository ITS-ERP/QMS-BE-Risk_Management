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

  public async getContractTotalController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const retail_code = req.query.retail_code as string | undefined;
      const contractTotal = await this.crmContractService.getContractTotal(
        industry_code,
        retail_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        contractTotal,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllOnTimeVsLateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const retail_code = req.query.retail_code as string | undefined;
      const allOnTimeVsLateTrend =
        await this.crmContractService.getAllOnTimeVsLateTrend(
          industry_code,
          retail_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        allOnTimeVsLateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const retail_code = req.query.retail_code as string | undefined;
      const top5LateTrend = await this.crmContractService.getLateTrend(
        industry_code,
        retail_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        top5LateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getQuantityComplianceController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const retail_code = req.query.retail_code as string | undefined;
      const quantityCompliance =
        await this.crmContractService.getQuantityCompliance(
          industry_code,
          retail_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        quantityCompliance,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getNonCompliantQuantityController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const retail_code = req.query.retail_code as string | undefined;
      const nonCompliantQuantity =
        await this.crmContractService.getNonCompliantQuantity(
          industry_code,
          retail_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        nonCompliantQuantity,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
