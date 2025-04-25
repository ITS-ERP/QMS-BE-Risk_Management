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

      if (!riskUser) {
        return this.handleError(req, res, 'Risk user is required', 400);
      }

      // Validasi kode yang sesuai diperlukan berdasarkan jenis user
      if (
        (riskUser === 'Industry' && !industryCode) ||
        (riskUser === 'Supplier' && !supplierCode) ||
        (riskUser === 'Retail' && !retailCode)
      ) {
        return this.handleError(
          req,
          res,
          `Parameter ${riskUser === 'Industry' ? 'industry_code' : riskUser === 'Supplier' ? 'supplier_code' : 'retail_code'} is required for risk_user ${riskUser}`,
          400,
        );
      }

      try {
        const riskIdentification =
          await this.riskIdentificationService.getRiskIdentification(
            req,
            riskUser,
            industryCode,
            supplierCode,
            retailCode,
          );

        // Jika tidak ada data yang ditemukan, kembalikan array kosong dengan pesan sukses
        if (!riskIdentification || riskIdentification.length === 0) {
          console.log(`No risk identification data found for ${riskUser}`);
          return this.sendSuccessGet(req, res, [], MessagesKey.SUCCESSGET, 200);
        }

        return this.sendSuccessGet(
          req,
          res,
          riskIdentification,
          MessagesKey.SUCCESSGET,
          200,
        );
      } catch (serviceError) {
        console.error('Service error:', serviceError);
        const errorMessage =
          serviceError instanceof Error
            ? serviceError.message
            : 'Unknown service error';
        return this.handleError(
          req,
          res,
          `Error processing request: ${errorMessage}`,
          500,
        );
      }
    } catch (error) {
      console.error('Controller error:', error);
      return this.handleError(req, res, error, 500);
    }
  }
}
