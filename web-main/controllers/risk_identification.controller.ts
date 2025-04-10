import { Request, Response } from 'express';
import { RiskIdentificationService } from '../../business-layer/services/risk_identification.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class RiskIdentificationController extends BaseController {
  private riskIdentificationService: RiskIdentificationService;

  constructor() {
    super();
    this.riskIdentificationService = new RiskIdentificationService();
  }

  // Controller untuk mendapatkan identifikasi risiko berdasarkan jenis pengguna
  public async getRiskIdentificationController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const riskUser = req.query.risk_user as string | undefined;
      const industryCode = req.query.industry_code as string | undefined;
      const supplierCode = req.query.supplier_code as string | undefined;
      const retailCode = req.query.retail_code as string | undefined;

      if (
        !riskUser ||
        (!industryCode && riskUser === 'Industry') ||
        (!supplierCode && riskUser === 'Supplier') ||
        (!retailCode && riskUser === 'Retail')
      ) {
        return this.handleError(
          req,
          res,
          'Risk user and appropriate code (industry_code, supplier_code, or retail_code) are required',
          400,
        );
      }

      const riskIdentification =
        await this.riskIdentificationService.getRiskIdentification(
          req,
          riskUser,
          industryCode,
          supplierCode,
          retailCode,
        );

      return this.sendSuccessGet(
        req,
        res,
        riskIdentification,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
