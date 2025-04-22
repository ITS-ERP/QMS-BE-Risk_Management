import { Request, Response } from 'express';
import { RiskIdentificationMitigationService } from '../../business-layer/services/risk_identification_mitigation.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class RiskIdentificationMitigationController extends BaseController {
  private riskIdentificationMitigationService: RiskIdentificationMitigationService;

  constructor() {
    super();
    this.riskIdentificationMitigationService =
      new RiskIdentificationMitigationService();
  }

  /**
   * Controller untuk mendapatkan gabungan identifikasi dan mitigasi risiko berdasarkan jenis pengguna
   */
  public async getRiskIdentificationMitigationController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      // Perbaiki parameter yang salah (typo atau tidak sesuai)
      // Misalnya jika user memilih Industry tapi menggunakan retail_code
      this.fixUserCodeParameters(req);

      // Extract query parameters
      const riskUser = req.query.risk_user as string | undefined;
      const tenantId = req.query.tenant_id as string | undefined;
      const industryCode = req.query.industry_code as string | undefined;
      const supplierCode = req.query.supplier_code as string | undefined;
      const retailCode = req.query.retail_code as string | undefined;

      console.log('Request parameters (fixed):', {
        riskUser,
        tenantId,
        industryCode,
        supplierCode,
        retailCode,
      });

      // Validate required parameters
      if (!riskUser) {
        return this.handleError(req, res, 'Risk user is required', 400);
      }

      // Validasi parameter berdasarkan jenis pengguna jika tenant_id tidak tersedia
      if (
        !tenantId &&
        ((riskUser === 'Industry' && !industryCode) ||
          (riskUser === 'Supplier' && !supplierCode) ||
          (riskUser === 'Retail' && !retailCode))
      ) {
        return this.handleError(
          req,
          res,
          `For ${riskUser} user, either tenant_id or ${riskUser.toLowerCase()}_code is required`,
          400,
        );
      }

      try {
        // Call service with proper parameters
        const riskIdentificationMitigation =
          await this.riskIdentificationMitigationService.getRiskIdentificationAndMitigation(
            req,
            riskUser,
            tenantId,
            industryCode,
            supplierCode,
            retailCode,
          );

        // Return empty array with standard success message if no data found
        if (
          !riskIdentificationMitigation ||
          riskIdentificationMitigation.length === 0
        ) {
          console.log(`No data found for ${riskUser} with given parameters`);
          return this.sendSuccessGet(req, res, [], MessagesKey.SUCCESSGET, 200);
        }

        console.log(
          `Found ${riskIdentificationMitigation.length} risk items for ${riskUser}`,
        );
        return this.sendSuccessGet(
          req,
          res,
          riskIdentificationMitigation,
          MessagesKey.SUCCESSGET,
          200,
        );
      } catch (serviceError: unknown) {
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
    } catch (error: unknown) {
      console.error('Controller error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return this.handleError(
        req,
        res,
        `Unexpected error: ${errorMessage}`,
        500,
      );
    }
  }

  /**
   * Controller untuk mendapatkan identifikasi dan mitigasi risiko spesifik berdasarkan nama risiko
   */
  public async getSpecificRiskIdentificationMitigationController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      // Perbaiki parameter yang salah (typo atau tidak sesuai)
      this.fixUserCodeParameters(req);

      // Extract query parameters
      const riskUser = req.query.risk_user as string | undefined;
      const riskName = req.query.risk_name as string | undefined;
      const tenantId = req.query.tenant_id as string | undefined;
      const industryCode = req.query.industry_code as string | undefined;
      const supplierCode = req.query.supplier_code as string | undefined;
      const retailCode = req.query.retail_code as string | undefined;

      console.log('Request parameters for specific risk (fixed):', {
        riskUser,
        riskName,
        tenantId,
        industryCode,
        supplierCode,
        retailCode,
      });

      // Validate required parameters
      if (!riskUser || !riskName) {
        return this.handleError(
          req,
          res,
          'Risk user and risk name are required',
          400,
        );
      }

      // Validasi parameter berdasarkan jenis pengguna jika tenant_id tidak tersedia
      if (
        !tenantId &&
        ((riskUser === 'Industry' && !industryCode) ||
          (riskUser === 'Supplier' && !supplierCode) ||
          (riskUser === 'Retail' && !retailCode))
      ) {
        return this.handleError(
          req,
          res,
          `For ${riskUser} user, either tenant_id or ${riskUser.toLowerCase()}_code is required`,
          400,
        );
      }

      try {
        // Call service with proper parameters
        const specificRiskData =
          await this.riskIdentificationMitigationService.getSpecificRiskIdentificationAndMitigation(
            req,
            riskUser,
            riskName,
            tenantId,
            industryCode,
            supplierCode,
            retailCode,
          );

        // Handle not found case
        if (!specificRiskData) {
          console.log(`Risk with name '${riskName}' not found for ${riskUser}`);
          return this.handleError(
            req,
            res,
            `Risk with name '${riskName}' not found for ${riskUser}`,
            404,
          );
        }

        console.log(`Found specific risk '${riskName}' for ${riskUser}`);
        return this.sendSuccessGet(
          req,
          res,
          specificRiskData,
          MessagesKey.SUCCESSGET,
          200,
        );
      } catch (serviceError: unknown) {
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
    } catch (error: unknown) {
      console.error('Controller error in specific risk:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return this.handleError(
        req,
        res,
        `Unexpected error: ${errorMessage}`,
        500,
      );
    }
  }

  /**
   * Memperbaiki parameter yang tidak sesuai dengan jenis pengguna
   * Misalnya jika user adalah Industry tapi kode yang digunakan adalah retail_code
   */
  private fixUserCodeParameters(req: Request): void {
    const riskUser = req.query.risk_user as string | undefined;
    if (!riskUser) return;

    // Jika user adalah Industry tetapi menggunakan kode yang salah
    if (riskUser === 'Industry') {
      // Jika menggunakan retail_code alih-alih industry_code
      if (req.query.retail_code && !req.query.industry_code) {
        console.log(
          'Correcting retail_code to industry_code for Industry user',
        );
        req.query.industry_code = req.query.retail_code;
        delete req.query.retail_code;
      }
      // Jika menggunakan supplier_code alih-alih industry_code
      if (req.query.supplier_code && !req.query.industry_code) {
        console.log(
          'Correcting supplier_code to industry_code for Industry user',
        );
        req.query.industry_code = req.query.supplier_code;
        delete req.query.supplier_code;
      }
    }

    // Jika user adalah Supplier tetapi menggunakan kode yang salah
    else if (riskUser === 'Supplier') {
      // Jika menggunakan retail_code alih-alih supplier_code
      if (req.query.retail_code && !req.query.supplier_code) {
        console.log(
          'Correcting retail_code to supplier_code for Supplier user',
        );
        req.query.supplier_code = req.query.retail_code;
        delete req.query.retail_code;
      }
      // Jika menggunakan industry_code alih-alih supplier_code
      if (req.query.industry_code && !req.query.supplier_code) {
        console.log(
          'Correcting industry_code to supplier_code for Supplier user',
        );
        req.query.supplier_code = req.query.industry_code;
        delete req.query.industry_code;
      }
    }

    // Jika user adalah Retail tetapi menggunakan kode yang salah
    else if (riskUser === 'Retail') {
      // Jika menggunakan industry_code alih-alih retail_code
      if (req.query.industry_code && !req.query.retail_code) {
        console.log('Correcting industry_code to retail_code for Retail user');
        req.query.retail_code = req.query.industry_code;
        delete req.query.industry_code;
      }
      // Jika menggunakan supplier_code alih-alih retail_code
      if (req.query.supplier_code && !req.query.retail_code) {
        console.log('Correcting supplier_code to retail_code for Retail user');
        req.query.retail_code = req.query.supplier_code;
        delete req.query.supplier_code;
      }
    }
  }
}
