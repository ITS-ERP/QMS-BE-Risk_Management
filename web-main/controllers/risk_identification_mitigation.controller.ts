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
   * Validate authentication header
   */
  private validateAuthHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return 'Authorization header is required';
    }
    if (!authHeader.startsWith('Bearer ')) {
      return 'Authorization header must be a Bearer token';
    }
    return null;
  }

  /**
   * Controller untuk mendapatkan gabungan identifikasi dan mitigasi risiko berdasarkan jenis pengguna
   */
  public async getRiskIdentificationMitigationController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      // Validate authentication
      const authError = this.validateAuthHeader(req);
      if (authError) {
        return this.handleError(req, res, authError, 401);
      }

      // Extract query parameters
      const riskUser = req.query.risk_user as string | undefined;
      const tenantId = req.query.tenant_id as string | undefined;

      console.log('Request parameters:', {
        riskUser,
        tenantId,
        hasAuth: !!req.headers.authorization,
      });

      // Validate required parameters
      if (!riskUser) {
        return this.handleError(req, res, 'Risk user is required', 400);
      }

      if (!tenantId) {
        return this.handleError(req, res, 'Tenant ID is required', 400);
      }

      const tenantIdNum = parseInt(tenantId, 10);
      if (isNaN(tenantIdNum)) {
        return this.handleError(
          req,
          res,
          'Tenant ID must be a valid number',
          400,
        );
      }

      try {
        // Call service with proper parameters (req object contains auth headers)
        const riskIdentificationMitigation =
          await this.riskIdentificationMitigationService.getRiskIdentificationAndMitigation(
            req,
            riskUser,
            tenantIdNum,
          );

        // Return empty array with standard success message if no data found
        if (
          !riskIdentificationMitigation ||
          riskIdentificationMitigation.length === 0
        ) {
          console.log(
            `No data found for ${riskUser} with tenant_id ${tenantIdNum}`,
          );
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

        // Check if it's an authentication error from downstream services
        if (
          errorMessage.includes('401') ||
          errorMessage.includes('unauthorized')
        ) {
          return this.handleError(
            req,
            res,
            'Authentication failed for external services',
            401,
          );
        }

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
      // Validate authentication
      const authError = this.validateAuthHeader(req);
      if (authError) {
        return this.handleError(req, res, authError, 401);
      }

      // Extract query parameters
      const riskUser = req.query.risk_user as string | undefined;
      const riskName = req.query.risk_name as string | undefined;
      const tenantId = req.query.tenant_id as string | undefined;

      console.log('Request parameters for specific risk:', {
        riskUser,
        riskName,
        tenantId,
        hasAuth: !!req.headers.authorization,
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

      if (!tenantId) {
        return this.handleError(req, res, 'Tenant ID is required', 400);
      }

      const tenantIdNum = parseInt(tenantId, 10);
      if (isNaN(tenantIdNum)) {
        return this.handleError(
          req,
          res,
          'Tenant ID must be a valid number',
          400,
        );
      }

      try {
        // Call service with proper parameters (req object contains auth headers)
        const specificRiskData =
          await this.riskIdentificationMitigationService.getSpecificRiskIdentificationAndMitigation(
            req,
            riskUser,
            riskName,
            tenantIdNum,
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

        // Check if it's an authentication error from downstream services
        if (
          errorMessage.includes('401') ||
          errorMessage.includes('unauthorized')
        ) {
          return this.handleError(
            req,
            res,
            'Authentication failed for external services',
            401,
          );
        }

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
}
