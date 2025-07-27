import { Request, Response } from 'express';
import { SRMContractService } from '../../business-layer/services/srm_contract.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class SRMContractController extends BaseController {
  private srmContractService: SRMContractService;

  constructor() {
    super();
    this.srmContractService = new SRMContractService();
  }
  public async getAllSRMContractController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allSRMContract =
        await this.srmContractService.fetchAllSRMContract(req);
      return this.sendSuccessGet(
        req,
        res,
        allSRMContract,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getAllOnTimeVsLateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }
      let industryTenantIdNum: number | undefined;
      if (industry_tenant_id) {
        industryTenantIdNum = parseInt(industry_tenant_id, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }
      let supplierTenantIdNum: number | undefined;
      if (supplier_tenant_id) {
        supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }

      const allOnTimeVsLateTrend =
        await this.srmContractService.getAllOnTimeVsLateTrend(
          req,
          industryTenantIdNum,
          supplierTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        allOnTimeVsLateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getLateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const top5LateTrend = await this.srmContractService.getLateTrend(
        req,
        industryTenantIdNum || undefined,
        supplierTenantIdNum || undefined,
      );

      return this.sendSuccessGet(
        req,
        res,
        top5LateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getLateReceiptSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const lateReceiptSummary =
        await this.srmContractService.getLateReceiptSummary(
          req,
          supplierTenantIdNum || undefined,
          industryTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        lateReceiptSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getLateReceiptRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const lateReceiptRiskRateTrend =
        await this.srmContractService.getLateReceiptRiskRateTrend(
          req,
          supplierTenantIdNum || undefined,
          industryTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        lateReceiptRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getQuantityComplianceController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const quantityCompliance =
        await this.srmContractService.getQuantityCompliance(
          req,
          industryTenantIdNum || undefined,
          supplierTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        quantityCompliance,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getNonCompliantQuantityController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const nonCompliantQuantity =
        await this.srmContractService.getNonCompliantQuantity(
          req,
          industryTenantIdNum || undefined,
          supplierTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        nonCompliantQuantity,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getQuantityMismatchSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const quantityMismatchSummary =
        await this.srmContractService.getQuantityMismatchSummary(
          req,
          supplierTenantIdNum || undefined,
          industryTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        quantityMismatchSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getQuantityMismatchRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const quantityMismatchRiskRateTrend =
        await this.srmContractService.getQuantityMismatchRiskRateTrend(
          req,
          supplierTenantIdNum || undefined,
          industryTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        quantityMismatchRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getContractTotalController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const contractTotal = await this.srmContractService.getContractTotal(
        req,
        industryTenantIdNum || undefined,
        supplierTenantIdNum || undefined,
      );

      return this.sendSuccessGet(
        req,
        res,
        contractTotal,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getContractDeclineSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const contractDeclineSummary =
        await this.srmContractService.getContractDeclineSummary(
          req,
          supplierTenantIdNum || undefined,
          industryTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        contractDeclineSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getContractDeclineRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as
        | string
        | undefined;
      const supplier_tenant_id = req.query.supplier_tenant_id as
        | string
        | undefined;

      const industryTenantIdNum = this.validateTenantId(
        industry_tenant_id,
        'industry_tenant_id',
      );
      const supplierTenantIdNum = this.validateTenantId(
        supplier_tenant_id,
        'supplier_tenant_id',
      );

      const contractDeclineRiskRateTrend =
        await this.srmContractService.getContractDeclineRiskRateTrend(
          req,
          supplierTenantIdNum || undefined,
          industryTenantIdNum || undefined,
        );

      return this.sendSuccessGet(
        req,
        res,
        contractDeclineRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getTopSuppliersController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_tenant_id = req.query.industry_tenant_id as string;

      if (!industry_tenant_id) {
        return res.status(400).json({
          message: 'industry_tenant_id is required',
          error: 'Missing required parameter: industry_tenant_id',
        });
      }

      const industryTenantIdNum = parseInt(industry_tenant_id, 10);
      if (isNaN(industryTenantIdNum)) {
        return res.status(400).json({
          message: 'industry_tenant_id must be a valid number',
          error: 'Invalid parameter type: industry_tenant_id',
        });
      }

      const topSuppliers = await this.srmContractService.getTopSuppliers(
        req,
        industryTenantIdNum,
      );

      return this.sendSuccessGet(
        req,
        res,
        topSuppliers,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  public async getTopIndustriesController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const supplier_tenant_id = req.query.supplier_tenant_id as string;

      if (!supplier_tenant_id) {
        return res.status(400).json({
          message: 'supplier_tenant_id is required',
          error: 'Missing required parameter: supplier_tenant_id',
        });
      }

      const supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
      if (isNaN(supplierTenantIdNum)) {
        return res.status(400).json({
          message: 'supplier_tenant_id must be a valid number',
          error: 'Invalid parameter type: supplier_tenant_id',
        });
      }

      const topIndustries = await this.srmContractService.getTopIndustries(
        req,
        supplierTenantIdNum,
      );

      return this.sendSuccessGet(
        req,
        res,
        topIndustries,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  private validateTenantId(
    tenantId: string | undefined,
    paramName: string,
  ): number | null {
    if (!tenantId) {
      return null;
    }

    const tenantIdNum = parseInt(tenantId, 10);
    if (isNaN(tenantIdNum)) {
      throw new Error(`${paramName} must be a valid number`);
    }

    return tenantIdNum;
  }

  private handleDetailedError(
    req: Request,
    res: Response,
    error: unknown,
    statusCode: number = 500,
  ): Response {
    console.error('SRM Contract Controller Error:', error);
    return super.handleError(req, res, error, statusCode);
  }
}
