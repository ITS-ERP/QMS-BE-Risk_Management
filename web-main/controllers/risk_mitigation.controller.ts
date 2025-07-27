import { Request, Response } from 'express';
import { RiskMitigationService } from '../../business-layer/services/risk_mitigation.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class RiskMitigationController extends BaseController {
  private riskMitigationService: RiskMitigationService;

  constructor() {
    super();
    this.riskMitigationService = new RiskMitigationService();
  }

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

  public async getRiskMitigationController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const authError = this.validateAuthHeader(req);
      if (authError) {
        return this.handleError(req, res, authError, 401);
      }
      const riskUser = req.query.risk_user as string | undefined;
      const tenantId = req.query.tenant_id as string | undefined;

      console.log('Request parameters:', {
        riskUser,
        tenantId,
        hasAuth: !!req.headers.authorization,
      });
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
        const riskMitigation =
          await this.riskMitigationService.getRiskMitigation(
            req,
            riskUser,
            tenantIdNum,
          );
        if (!riskMitigation || riskMitigation.length === 0) {
          console.log(
            `No data found for ${riskUser} with tenant_id ${tenantIdNum}`,
          );
          return this.sendSuccessGet(req, res, [], MessagesKey.SUCCESSGET, 200);
        }

        console.log(
          `Found ${riskMitigation.length} risk mitigation items for ${riskUser}`,
        );
        return this.sendSuccessGet(
          req,
          res,
          riskMitigation,
          MessagesKey.SUCCESSGET,
          200,
        );
      } catch (serviceError: unknown) {
        console.error('Service error:', serviceError);
        const errorMessage =
          serviceError instanceof Error
            ? serviceError.message
            : 'Unknown service error';
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

  public async getRiskMitigationByPkidController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const authError = this.validateAuthHeader(req);
      if (authError) {
        return this.handleError(req, res, authError, 401);
      }
      const pkidParam = req.params.pkid;
      const riskUser = req.query.risk_user as string | undefined;
      const tenantId = req.query.tenant_id as string | undefined;

      console.log('Request parameters for PKID risk mitigation:', {
        pkid: pkidParam,
        riskUser,
        tenantId,
        hasAuth: !!req.headers.authorization,
      });
      if (!pkidParam) {
        return this.handleError(req, res, 'PKID is required', 400);
      }

      const pkid = parseInt(pkidParam, 10);
      if (isNaN(pkid)) {
        return this.handleError(req, res, 'PKID must be a valid number', 400);
      }
      let tenantIdNum: number | undefined = undefined;
      if (tenantId) {
        tenantIdNum = parseInt(tenantId, 10);
        if (isNaN(tenantIdNum)) {
          return this.handleError(
            req,
            res,
            'Tenant ID must be a valid number',
            400,
          );
        }
      }

      try {
        const riskMitigation =
          await this.riskMitigationService.getRiskMitigationByPkid(
            req,
            pkid,
            riskUser,
            tenantIdNum,
          );
        if (!riskMitigation) {
          let notFoundMessage = `Risk mitigation with PKID ${pkid} not found`;
          if (riskUser) {
            notFoundMessage += ` for ${riskUser}`;
          }
          if (tenantIdNum) {
            notFoundMessage += ` with tenant_id ${tenantIdNum}`;
          }

          console.log(notFoundMessage);
          return this.handleError(req, res, notFoundMessage, 404);
        }

        console.log(`Found risk mitigation with PKID ${pkid}`);
        return this.sendSuccessGet(
          req,
          res,
          riskMitigation,
          MessagesKey.SUCCESSGET,
          200,
        );
      } catch (serviceError: unknown) {
        console.error('Service error in PKID risk mitigation:', serviceError);
        const errorMessage =
          serviceError instanceof Error
            ? serviceError.message
            : 'Unknown service error';
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
      console.error('Controller error in PKID risk mitigation:', error);
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

  public async getSpecificRiskMitigationController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const authError = this.validateAuthHeader(req);
      if (authError) {
        return this.handleError(req, res, authError, 401);
      }
      const riskUser = req.query.risk_user as string | undefined;
      const riskName = req.query.risk_name as string | undefined;
      const tenantId = req.query.tenant_id as string | undefined;

      console.log('Request parameters for specific risk mitigation:', {
        riskUser,
        riskName,
        tenantId,
        hasAuth: !!req.headers.authorization,
      });
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
        const specificRiskMitigation =
          await this.riskMitigationService.getSpecificRiskMitigation(
            req,
            riskUser,
            riskName,
            tenantIdNum,
          );
        if (!specificRiskMitigation) {
          console.log(
            `Risk mitigation with name '${riskName}' not found for ${riskUser}`,
          );
          return this.handleError(
            req,
            res,
            `Risk mitigation with name '${riskName}' not found for ${riskUser}`,
            404,
          );
        }

        console.log(
          `Found specific risk mitigation '${riskName}' for ${riskUser}`,
        );
        return this.sendSuccessGet(
          req,
          res,
          specificRiskMitigation,
          MessagesKey.SUCCESSGET,
          200,
        );
      } catch (serviceError: unknown) {
        console.error(
          'Service error in specific risk mitigation:',
          serviceError,
        );
        const errorMessage =
          serviceError instanceof Error
            ? serviceError.message
            : 'Unknown service error';
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
      console.error('Controller error in specific risk mitigation:', error);
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
