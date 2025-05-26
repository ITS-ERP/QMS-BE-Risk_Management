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
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const contractTotal = await this.crmContractService.getContractTotal(
        industry_tenant_id,
        retail_tenant_id,
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
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const allOnTimeVsLateTrend =
        await this.crmContractService.getAllOnTimeVsLateTrend(
          industry_tenant_id,
          retail_tenant_id,
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
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const top5LateTrend = await this.crmContractService.getLateTrend(
        industry_tenant_id,
        retail_tenant_id,
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
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const quantityCompliance =
        await this.crmContractService.getQuantityCompliance(
          industry_tenant_id,
          retail_tenant_id,
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
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const nonCompliantQuantity =
        await this.crmContractService.getNonCompliantQuantity(
          industry_tenant_id,
          retail_tenant_id,
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

  public async getContractDeclineSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const contractDeclineSummary =
        await this.crmContractService.getContractDeclineSummary(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        contractDeclineSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLateDeliverySummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const lateDeliverySummary =
        await this.crmContractService.getLateDeliverySummary(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        lateDeliverySummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getQuantityMismatchSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const quantityMismatchSummary =
        await this.crmContractService.getQuantityMismatchSummary(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        quantityMismatchSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getContractDeclineRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const contractDeclineRiskRateTrend =
        await this.crmContractService.getContractDeclineRiskRateTrend(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        contractDeclineRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLateDeliveryRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const lateDeliveryRiskRateTrend =
        await this.crmContractService.getLateDeliveryRiskRateTrend(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        lateDeliveryRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getQuantityMismatchRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id
        ? Number(req.query.industry_tenant_id)
        : undefined;
      const retail_tenant_id = req.query.retail_tenant_id
        ? Number(req.query.retail_tenant_id)
        : undefined;

      const quantityMismatchRiskRateTrend =
        await this.crmContractService.getQuantityMismatchRiskRateTrend(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        quantityMismatchRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
