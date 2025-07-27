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
  public async getRiskMonitoringController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const riskUser = req.query.risk_user as string | undefined;
      const industryTenantId = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplierTenantId = req.query.supplier_tenant_id as
        | string
        | undefined;
      const retailTenantId = req.query.retail_tenant_id as string | undefined;
      if (!riskUser) {
        return res.status(400).json({
          message: 'risk_user is required',
          error: 'Missing required parameter: risk_user',
        });
      }
      const normalizedRiskUser = riskUser.toLowerCase();
      if (normalizedRiskUser === 'industry' && !industryTenantId) {
        return res.status(400).json({
          message: 'industry_tenant_id is required for risk_user Industry',
          error: 'Missing required parameter: industry_tenant_id',
        });
      }

      if (normalizedRiskUser === 'supplier' && !supplierTenantId) {
        return res.status(400).json({
          message: 'supplier_tenant_id is required for risk_user Supplier',
          error: 'Missing required parameter: supplier_tenant_id',
        });
      }

      if (normalizedRiskUser === 'retail' && !retailTenantId) {
        return res.status(400).json({
          message: 'retail_tenant_id is required for risk_user Retail',
          error: 'Missing required parameter: retail_tenant_id',
        });
      }
      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;
      let retailTenantIdNum: number | undefined;
      if (industryTenantId) {
        industryTenantIdNum = parseInt(industryTenantId, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }
      if (supplierTenantId) {
        supplierTenantIdNum = parseInt(supplierTenantId, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }
      if (retailTenantId) {
        retailTenantIdNum = parseInt(retailTenantId, 10);
        if (isNaN(retailTenantIdNum)) {
          return res.status(400).json({
            message: 'retail_tenant_id must be a valid number',
            error: 'Invalid parameter type: retail_tenant_id',
          });
        }
      }

      try {
        const riskMonitoring =
          await this.riskMonitoringService.getRiskMonitoring(
            req,
            riskUser,
            industryTenantIdNum,
            supplierTenantIdNum,
            retailTenantIdNum,
          );
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
        return res.status(500).json({
          message: `Error processing request: ${errorMessage}`,
          error: 'Internal service error',
        });
      }
    } catch (error) {
      console.error('Controller error:', error);
      return this.handleError(req, res, error, 500);
    }
  }
  public async getSpecificRiskMonitoringController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const riskUser = req.query.risk_user as string | undefined;
      const riskName = req.query.risk_name as string | undefined;
      const industryTenantId = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplierTenantId = req.query.supplier_tenant_id as
        | string
        | undefined;
      const retailTenantId = req.query.retail_tenant_id as string | undefined;
      if (!riskUser || !riskName) {
        return res.status(400).json({
          message: 'risk_user and risk_name are required',
          error: 'Missing required parameters: risk_user AND risk_name',
        });
      }
      const normalizedRiskUser = riskUser.toLowerCase();
      if (normalizedRiskUser === 'industry' && !industryTenantId) {
        return res.status(400).json({
          message: 'industry_tenant_id is required for risk_user Industry',
          error: 'Missing required parameter: industry_tenant_id',
        });
      }

      if (normalizedRiskUser === 'supplier' && !supplierTenantId) {
        return res.status(400).json({
          message: 'supplier_tenant_id is required for risk_user Supplier',
          error: 'Missing required parameter: supplier_tenant_id',
        });
      }

      if (normalizedRiskUser === 'retail' && !retailTenantId) {
        return res.status(400).json({
          message: 'retail_tenant_id is required for risk_user Retail',
          error: 'Missing required parameter: retail_tenant_id',
        });
      }
      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;
      let retailTenantIdNum: number | undefined;
      if (industryTenantId) {
        industryTenantIdNum = parseInt(industryTenantId, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }
      if (supplierTenantId) {
        supplierTenantIdNum = parseInt(supplierTenantId, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }
      if (retailTenantId) {
        retailTenantIdNum = parseInt(retailTenantId, 10);
        if (isNaN(retailTenantIdNum)) {
          return res.status(400).json({
            message: 'retail_tenant_id must be a valid number',
            error: 'Invalid parameter type: retail_tenant_id',
          });
        }
      }

      try {
        const specificRiskMonitoring =
          await this.riskMonitoringService.getSpecificRiskMonitoring(
            req,
            riskUser,
            riskName,
            industryTenantIdNum,
            supplierTenantIdNum,
            retailTenantIdNum,
          );

        if (!specificRiskMonitoring) {
          return res.status(404).json({
            message: `Risk with name "${riskName}" not found for ${riskUser}`,
            error: 'Resource not found',
          });
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
        return res.status(500).json({
          message: `Error processing request: ${errorMessage}`,
          error: 'Internal service error',
        });
      }
    } catch (error) {
      console.error('Controller error in specific risk:', error);
      return this.handleError(req, res, error, 500);
    }
  }
}
