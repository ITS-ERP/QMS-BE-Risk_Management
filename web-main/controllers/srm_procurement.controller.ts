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

  public async getRFQOnTimeDelayedCountController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string;
      if (!industry_code) {
        return res.status(400).json({ message: 'industry_code is required' });
      }

      const winLoseCount =
        await this.srmProcurementService.getRFQOnTimeDelayedCount(
          industry_code,
        );
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

  public async getRFQDelayCountController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string;
      if (!industry_code) {
        return res.status(400).json({ message: 'industry_code is required' });
      }

      const delayCount =
        await this.srmProcurementService.getRFQDelayCount(industry_code);
      return this.sendSuccessGet(
        req,
        res,
        delayCount,
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

  //BARU
  public async getRFQDelaySummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const rfqDelaySummary =
        await this.srmProcurementService.getRFQDelaySummary(industry_code);
      return this.sendSuccessGet(
        req,
        res,
        rfqDelaySummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getRFQLossSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const supplier_code = req.query.supplier_code as string;
      if (!supplier_code) {
        return res.status(400).json({ message: 'supplier_code is required' });
      }

      const rfqLossSummary =
        await this.srmProcurementService.getRFQLossSummary(supplier_code);
      return this.sendSuccessGet(
        req,
        res,
        rfqLossSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Controller untuk Risk Rate Trend pada Keterlambatan RFQ
  public async getRFQDelayRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const rfqDelayRiskRateTrend =
        await this.srmProcurementService.getRFQDelayRiskRateTrend(
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        rfqDelayRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Controller untuk Risk Rate Trend pada Kekalahan pada proses RFQ
  public async getRFQLossRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const supplier_code = req.query.supplier_code as string;
      if (!supplier_code) {
        return res.status(400).json({ message: 'supplier_code is required' });
      }

      const rfqLossRiskRateTrend =
        await this.srmProcurementService.getRFQLossRiskRateTrend(supplier_code);
      return this.sendSuccessGet(
        req,
        res,
        rfqLossRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
