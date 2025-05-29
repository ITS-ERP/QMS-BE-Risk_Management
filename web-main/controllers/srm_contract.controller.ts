import { Request, Response } from 'express';
import { SRMContractService } from '../../business-layer/services/srm_contract.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

/**
 * SRM Contract Controller for Risk Management
 * Updated to work with new SRM integration system
 * Maintains same endpoint names for compatibility but uses tenant-based parameters
 * Note: Quality control endpoints (cleanliness, brix) removed as not available in new system
 */
export class SRMContractController extends BaseController {
  private srmContractService: SRMContractService;

  constructor() {
    super();
    this.srmContractService = new SRMContractService();
  }

  // ============================================================================
  // LEGACY COMPATIBILITY ENDPOINT
  // ============================================================================
  public async getAllSRMContractController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allSRMContract =
        await this.srmContractService.fetchAllSRMContract();
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

  // ============================================================================
  // DELIVERY PERFORMANCE ANALYSIS
  // ============================================================================

  /**
   * Get on-time vs late delivery trend analysis
   * Updated to use tenant-based parameters with flexible industry/supplier filtering
   */
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

      // Validate at least one parameter is provided
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      // Validate industry_tenant_id if provided
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

      // Validate supplier_tenant_id if provided
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

  /**
   * Get late delivery trend (only late deliveries)
   * Updated to use tenant-based parameters
   */
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

      // Validate at least one parameter is provided
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

  /**
   * Get late receipt summary
   * Updated to use tenant-based parameters with flexible parameter order
   */
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

  /**
   * Get late receipt risk rate trend
   * Updated to use tenant-based parameters
   */
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

  // ============================================================================
  // QUANTITY COMPLIANCE ANALYSIS
  // ============================================================================

  /**
   * Get quantity compliance analysis (target vs actual quantity)
   * Updated to use tenant-based parameters
   */
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

  /**
   * Get non-compliant quantity trend
   * Updated to use tenant-based parameters
   */
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

  /**
   * Get quantity mismatch summary
   * Updated to use tenant-based parameters
   */
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

  /**
   * Get quantity mismatch risk rate trend
   * Updated to use tenant-based parameters
   */
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

  // ============================================================================
  // CONTRACT VOLUME ANALYSIS
  // ============================================================================

  /**
   * Get total contract count analysis
   * Updated to use tenant-based parameters
   */
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

  /**
   * Get contract decline summary
   * Updated to use tenant-based parameters
   */
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

  /**
   * Get contract decline risk rate trend
   * Updated to use tenant-based parameters
   */
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

  // ============================================================================
  // ADDITIONAL ANALYTICS ENDPOINTS
  // ============================================================================

  /**
   * Get top suppliers for industry
   * New endpoint for enhanced analytics
   */
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

      const topSuppliers =
        await this.srmContractService.getTopSuppliers(industryTenantIdNum);

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

  /**
   * Get top industries for supplier
   * New endpoint for enhanced analytics
   */
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

      const topIndustries =
        await this.srmContractService.getTopIndustries(supplierTenantIdNum);

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

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Validate and parse tenant ID parameter
   * Reusable validation logic that returns null for empty/invalid values
   */
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

  /**
   * Enhanced error handling with detailed error information
   * Uses parent class handleError method to maintain compatibility
   */
  private handleDetailedError(
    req: Request,
    res: Response,
    error: unknown,
    statusCode: number = 500,
  ): Response {
    console.error('SRM Contract Controller Error:', error);

    // Use parent class handleError method for compatibility
    return super.handleError(req, res, error, statusCode);
  }
}
