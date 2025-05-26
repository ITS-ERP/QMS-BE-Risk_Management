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

  public async getAllLoRAcceptRejectController(
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

      const allLoRAcceptReject =
        await this.crmRequisitionService.getAllLoRAcceptReject(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        allLoRAcceptReject,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLoRRejectController(
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

      const loRReject = await this.crmRequisitionService.getLoRReject(
        industry_tenant_id,
        retail_tenant_id,
      );
      return this.sendSuccessGet(
        req,
        res,
        loRReject,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllLoAAcceptRejectController(
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

      const allLoAAcceptReject =
        await this.crmRequisitionService.getAllLoAAcceptReject(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        allLoAAcceptReject,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLoARejectController(
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

      const loAReject = await this.crmRequisitionService.getLoAReject(
        industry_tenant_id,
        retail_tenant_id,
      );
      return this.sendSuccessGet(
        req,
        res,
        loAReject,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLoRRejectionSummaryController(
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

      const loRRejectionSummary =
        await this.crmRequisitionService.getLoRRejectionSummary(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        loRRejectionSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLoARejectionSummaryController(
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

      const loARejectionSummary =
        await this.crmRequisitionService.getLoARejectionSummary(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        loARejectionSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLoRRejectionRiskRateTrendController(
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

      const loRRejectionRiskRateTrend =
        await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        loRRejectionRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLoARejectionRiskRateTrendController(
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

      const loARejectionRiskRateTrend =
        await this.crmRequisitionService.getLoARejectionRiskRateTrend(
          industry_tenant_id,
          retail_tenant_id,
        );
      return this.sendSuccessGet(
        req,
        res,
        loARejectionRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
