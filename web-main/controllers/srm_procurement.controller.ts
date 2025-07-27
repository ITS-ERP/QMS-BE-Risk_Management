import { Request, Response } from 'express';
import { SRMProcurementService } from '../../business-layer/services/srm_procurement.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

/**
 * SRM Procurement Controller for Risk Management
 * Updated to work with new SRM integration system
 * Maintains same endpoint names for compatibility but uses tenant-based parameters
 */
export class SRMProcurementController extends BaseController {
  private srmProcurementService: SRMProcurementService;

  constructor() {
    super();
    this.srmProcurementService = new SRMProcurementService();
  }

  // ============================================================================
  // LEGACY COMPATIBILITY ENDPOINT
  // ============================================================================
  public async getAllSRMProcurementController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allSRMProcurement =
        await this.srmProcurementService.fetchAllSRMProcurement(req);
      return this.sendSuccessGet(
        req,
        res,
        allSRMProcurement,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  // ============================================================================
  // NEW - DIRECT RFQ REJECT ENDPOINTS (untuk menggantikan delay endpoints)
  // ============================================================================

  /**
   * Get Direct RFQ reject count (untuk forecast)
   * Supports both industry_tenant_id and supplier_tenant_id
   */
  public async getDirectRFQRejectCountController(
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

      // Validate that one of the parameters is provided
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      // Validate that only one parameter is provided
      if (industry_tenant_id && supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Please provide either industry_tenant_id or supplier_tenant_id, not both',
          error:
            'Too many parameters: industry_tenant_id AND supplier_tenant_id',
        });
      }

      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;

      // Parse industry_tenant_id if provided
      if (industry_tenant_id) {
        industryTenantIdNum = parseInt(industry_tenant_id, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }

      // Parse supplier_tenant_id if provided
      if (supplier_tenant_id) {
        supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }

      // Menggunakan getRFQLossRiskRateTrend untuk mendapatkan data Direct RFQ rejection
      const directRFQRejectData =
        await this.srmProcurementService.getRFQLossRiskRateTrend(
          req,
          industryTenantIdNum,
          supplierTenantIdNum,
        );

      // Transform data untuk format yang dibutuhkan forecast (year sebagai number)
      const formattedData = directRFQRejectData.map((item) => ({
        year: parseInt(item.year),
        value: item.value,
      }));

      return this.sendSuccessGet(
        req,
        res,
        formattedData,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  /**
   * Get RFQ reject summary (alias untuk getRFQLossSummaryController)
   * Supports both industry_tenant_id and supplier_tenant_id
   */
  public async getRFQRejectSummaryController(
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

      // Validate that one of the parameters is provided
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      // Validate that only one parameter is provided
      if (industry_tenant_id && supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Please provide either industry_tenant_id or supplier_tenant_id, not both',
          error:
            'Too many parameters: industry_tenant_id AND supplier_tenant_id',
        });
      }

      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;

      // Parse industry_tenant_id if provided
      if (industry_tenant_id) {
        industryTenantIdNum = parseInt(industry_tenant_id, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }

      // Parse supplier_tenant_id if provided
      if (supplier_tenant_id) {
        supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }

      // Menggunakan getRFQLossSummary untuk mendapatkan Direct RFQ rejection summary
      const rfqRejectSummary =
        await this.srmProcurementService.getRFQLossSummary(
          req,
          industryTenantIdNum,
          supplierTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        rfqRejectSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  // ============================================================================
  // INDUSTRY PERSPECTIVE - RFQ DELAY RISK ANALYSIS
  // ============================================================================

  /**
   * Get RFQ on-time vs delayed count for industry analysis
   * Only supports industry_tenant_id
   */
  public async getRFQOnTimeDelayedCountController(
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

      const onTimeDelayedCount =
        await this.srmProcurementService.getRFQOnTimeDelayedCount(
          req,
          industryTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        onTimeDelayedCount,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  /**
   * Get RFQ delay count for industry analysis
   * Only supports industry_tenant_id
   */
  public async getRFQDelayCountController(
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

      const delayCount = await this.srmProcurementService.getRFQDelayCount(
        req,
        industryTenantIdNum,
      );

      return this.sendSuccessGet(
        req,
        res,
        delayCount,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  /**
   * Get RFQ delay summary for industry analysis
   * Only supports industry_tenant_id
   */
  public async getRFQDelaySummaryController(
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

      const rfqDelaySummary =
        await this.srmProcurementService.getRFQDelaySummary(
          req,
          industryTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        rfqDelaySummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  /**
   * Get RFQ delay risk rate trend for industry analysis
   * Only supports industry_tenant_id
   */
  public async getRFQDelayRiskRateTrendController(
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

      const rfqDelayRiskRateTrend =
        await this.srmProcurementService.getRFQDelayRiskRateTrend(
          req,
          industryTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        rfqDelayRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  // ============================================================================
  // DUAL PERSPECTIVE - RFQ WIN/LOSS RISK ANALYSIS (Industry OR Supplier)
  // ============================================================================

  /**
   * Get RFQ win vs lose count
   * Supports both industry_tenant_id (Direct RFQ) and supplier_tenant_id (Open & Invitation RFQ)
   */
  public async getWinLoseCountController(
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

      // Validate that one of the parameters is provided
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      // Validate that only one parameter is provided
      if (industry_tenant_id && supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Please provide either industry_tenant_id or supplier_tenant_id, not both',
          error:
            'Too many parameters: industry_tenant_id AND supplier_tenant_id',
        });
      }

      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;

      // Parse industry_tenant_id if provided
      if (industry_tenant_id) {
        industryTenantIdNum = parseInt(industry_tenant_id, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }

      // Parse supplier_tenant_id if provided
      if (supplier_tenant_id) {
        supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }

      const winLoseCount = await this.srmProcurementService.getWinLoseCount(
        req,
        industryTenantIdNum,
        supplierTenantIdNum,
      );

      return this.sendSuccessGet(
        req,
        res,
        winLoseCount,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  /**
   * Get RFQ lose count
   * Supports both industry_tenant_id (Direct RFQ) and supplier_tenant_id (Open & Invitation RFQ)
   */
  public async getLoseCountController(
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

      // Validate that one of the parameters is provided
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      // Validate that only one parameter is provided
      if (industry_tenant_id && supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Please provide either industry_tenant_id or supplier_tenant_id, not both',
          error:
            'Too many parameters: industry_tenant_id AND supplier_tenant_id',
        });
      }

      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;

      // Parse industry_tenant_id if provided
      if (industry_tenant_id) {
        industryTenantIdNum = parseInt(industry_tenant_id, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }

      // Parse supplier_tenant_id if provided
      if (supplier_tenant_id) {
        supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }

      const loseCount = await this.srmProcurementService.getLoseCount(
        req,
        industryTenantIdNum,
        supplierTenantIdNum,
      );

      return this.sendSuccessGet(
        req,
        res,
        loseCount,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  /**
   * Get RFQ loss summary
   * Supports both industry_tenant_id (Direct RFQ) and supplier_tenant_id (Open & Invitation RFQ)
   */
  public async getRFQLossSummaryController(
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

      // Validate that one of the parameters is provided
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      // Validate that only one parameter is provided
      if (industry_tenant_id && supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Please provide either industry_tenant_id or supplier_tenant_id, not both',
          error:
            'Too many parameters: industry_tenant_id AND supplier_tenant_id',
        });
      }

      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;

      // Parse industry_tenant_id if provided
      if (industry_tenant_id) {
        industryTenantIdNum = parseInt(industry_tenant_id, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }

      // Parse supplier_tenant_id if provided
      if (supplier_tenant_id) {
        supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }

      const rfqLossSummary = await this.srmProcurementService.getRFQLossSummary(
        req,
        industryTenantIdNum,
        supplierTenantIdNum,
      );

      return this.sendSuccessGet(
        req,
        res,
        rfqLossSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleDetailedError(req, res, error, 500);
    }
  }

  /**
   * Get RFQ loss risk rate trend
   * Supports both industry_tenant_id (Direct RFQ) and supplier_tenant_id (Open & Invitation RFQ)
   */
  public async getRFQLossRiskRateTrendController(
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

      // Validate that one of the parameters is provided
      if (!industry_tenant_id && !supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Either industry_tenant_id or supplier_tenant_id is required',
          error:
            'Missing required parameter: industry_tenant_id OR supplier_tenant_id',
        });
      }

      // Validate that only one parameter is provided
      if (industry_tenant_id && supplier_tenant_id) {
        return res.status(400).json({
          message:
            'Please provide either industry_tenant_id or supplier_tenant_id, not both',
          error:
            'Too many parameters: industry_tenant_id AND supplier_tenant_id',
        });
      }

      let industryTenantIdNum: number | undefined;
      let supplierTenantIdNum: number | undefined;

      // Parse industry_tenant_id if provided
      if (industry_tenant_id) {
        industryTenantIdNum = parseInt(industry_tenant_id, 10);
        if (isNaN(industryTenantIdNum)) {
          return res.status(400).json({
            message: 'industry_tenant_id must be a valid number',
            error: 'Invalid parameter type: industry_tenant_id',
          });
        }
      }

      // Parse supplier_tenant_id if provided
      if (supplier_tenant_id) {
        supplierTenantIdNum = parseInt(supplier_tenant_id, 10);
        if (isNaN(supplierTenantIdNum)) {
          return res.status(400).json({
            message: 'supplier_tenant_id must be a valid number',
            error: 'Invalid parameter type: supplier_tenant_id',
          });
        }
      }

      const rfqLossRiskRateTrend =
        await this.srmProcurementService.getRFQLossRiskRateTrend(
          req,
          industryTenantIdNum,
          supplierTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        rfqLossRiskRateTrend,
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
   * Get comprehensive RFQ statistics for industry
   * New endpoint for enhanced analytics
   */
  public async getComprehensiveRFQStatsController(
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

      const comprehensiveStats =
        await this.srmProcurementService.getComprehensiveRFQStats(
          req,
          industryTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        comprehensiveStats,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  /**
   * Get comprehensive RFQ statistics for supplier
   * New endpoint for enhanced analytics
   */
  public async getSupplierRFQStatsController(
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

      const supplierStats =
        await this.srmProcurementService.getSupplierRFQStats(
          req,
          supplierTenantIdNum,
        );

      return this.sendSuccessGet(
        req,
        res,
        supplierStats,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

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
    console.error('SRM Procurement Controller Error:', error);

    // Use parent class handleError method for compatibility
    return super.handleError(req, res, error, statusCode);
  }
}
