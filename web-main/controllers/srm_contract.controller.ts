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

  public async getAllOnTimeVsLateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const allOnTimeVsLateTrend =
        await this.srmContractService.getAllOnTimeVsLateTrend(
          industry_code,
          supplier_code,
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
      const supplier_code = req.query.supplier_code as string | undefined;
      const top5LateTrend = await this.srmContractService.getLateTrend(
        industry_code,
        supplier_code,
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
      const supplier_code = req.query.supplier_code as string | undefined;
      const quantityCompliance =
        await this.srmContractService.getQuantityCompliance(
          industry_code,
          supplier_code,
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
      const supplier_code = req.query.supplier_code as string | undefined;
      const nonCompliantQuantity =
        await this.srmContractService.getNonCompliantQuantity(
          industry_code,
          supplier_code,
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

  public async getCleanlinessCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const cleanlinessCheck =
        await this.srmContractService.getCleanlinessCheck(
          industry_code,
          supplier_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        cleanlinessCheck,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getUncleanCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const uncleanCheck = await this.srmContractService.getUncleanCheck(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        uncleanCheck,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getBrixCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const brixCheck = await this.srmContractService.getBrixCheck(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        brixCheck,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getUnderBrixCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const underBrixCheck = await this.srmContractService.getUnderBrixCheck(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        underBrixCheck,
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
      const supplier_code = req.query.supplier_code as string | undefined;
      const contractTotal = await this.srmContractService.getContractTotal(
        industry_code,
        supplier_code,
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
}
