import { Request, Response } from 'express';
import { RiskMonitoringService } from '../../business-layer/services/risk_monitoring.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class RiskMonitoringController extends BaseController {
  private riskMonitoringService: RiskMonitoringService;

  constructor() {
    super();
    this.riskMonitoringService = new RiskMonitoringService();
  }

  // Controller untuk mendapatkan monitoring risiko berdasarkan jenis pengguna
  public async getRiskMonitoringController(
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

      // Normalisasi riskUser untuk perbandingan case-insensitive
      const normalizedRiskUser = riskUser.toLowerCase();

      // Validasi bahwa kode yang sesuai disediakan berdasarkan riskUser
      if (
        (normalizedRiskUser === 'industry' && !industryCode) ||
        (normalizedRiskUser === 'supplier' && !supplierCode) ||
        (normalizedRiskUser === 'retail' && !retailCode)
      ) {
        return this.handleError(
          req,
          res,
          `Parameter ${normalizedRiskUser === 'industry' ? 'industry_code' : normalizedRiskUser === 'supplier' ? 'supplier_code' : 'retail_code'} is required for risk_user ${riskUser}`,
          400,
        );
      }

      try {
        const riskMonitoring =
          await this.riskMonitoringService.getRiskMonitoring(
            req,
            riskUser,
            industryCode,
            supplierCode,
            retailCode,
          );

        // Jika tidak ada data yang ditemukan, kembalikan array kosong dengan pesan sukses
        if (!riskMonitoring || riskMonitoring.length === 0) {
          console.log(`No risk monitoring data found for ${riskUser}`);
          return this.sendSuccessGet(req, res, [], MessagesKey.SUCCESSGET, 200);
        }

        return this.sendSuccessGet(
          req,
          res,
          riskMonitoring,
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

  // Controller untuk mendapatkan monitoring risiko spesifik
  public async getSpecificRiskMonitoringController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const riskUser = req.query.risk_user as string | undefined;
      const riskName = req.query.risk_name as string | undefined;
      const industryCode = req.query.industry_code as string | undefined;
      const supplierCode = req.query.supplier_code as string | undefined;
      const retailCode = req.query.retail_code as string | undefined;

      if (!riskUser || !riskName) {
        return this.handleError(
          req,
          res,
          'Risk user and risk name are required',
          400,
        );
      }

      // Normalisasi riskUser untuk perbandingan case-insensitive
      const normalizedRiskUser = riskUser.toLowerCase();

      // Validasi bahwa kode yang sesuai disediakan berdasarkan riskUser
      if (
        (normalizedRiskUser === 'industry' && !industryCode) ||
        (normalizedRiskUser === 'supplier' && !supplierCode) ||
        (normalizedRiskUser === 'retail' && !retailCode)
      ) {
        return this.handleError(
          req,
          res,
          `Parameter ${normalizedRiskUser === 'industry' ? 'industry_code' : normalizedRiskUser === 'supplier' ? 'supplier_code' : 'retail_code'} is required for risk_user ${riskUser}`,
          400,
        );
      }

      try {
        const specificRiskMonitoring =
          await this.riskMonitoringService.getSpecificRiskMonitoring(
            req,
            riskUser,
            riskName,
            industryCode,
            supplierCode,
            retailCode,
          );

        if (!specificRiskMonitoring) {
          return this.handleError(
            req,
            res,
            `Risk with name "${riskName}" not found for ${riskUser}`,
            404,
          );
        }

        return this.sendSuccessGet(
          req,
          res,
          specificRiskMonitoring,
          MessagesKey.SUCCESSGET,
          200,
        );
      } catch (serviceError) {
        console.error('Service error in specific risk:', serviceError);
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
      console.error('Controller error in specific risk:', error);
      return this.handleError(req, res, error, 500);
    }
  }
}
