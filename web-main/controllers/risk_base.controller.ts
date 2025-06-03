import { Request, Response } from 'express';
import { RiskBaseService } from '../../business-layer/services/risk_base.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { RiskBaseInputVM } from '../../helpers/view-models/risk_base.vm';
// import { RiskBaseAttributes } from '../../infrastructure/models/risk_base.model';

export class RiskBaseController extends BaseController {
  private riskBaseService: RiskBaseService;

  constructor() {
    super();
    this.riskBaseService = new RiskBaseService();
  }

  // ============================================================================
  // ORIGINAL METHODS (Unchanged)
  // ============================================================================

  public async findAllRiskBases(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const riskBases = await this.riskBaseService.findAllRiskBases(req);
      if (riskBases && riskBases.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          riskBases,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findRiskBaseByID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const riskBase = await this.riskBaseService.findRiskBaseByID(req, pkid);
      if (riskBase) {
        return this.sendSuccessGet(
          req,
          res,
          riskBase,
          MessagesKey.SUCCESSGETBYID,
          200,
        );
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findRiskBasesByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      // Konversi req.query menjadi Record<string, string | number | undefined>
      const criteria: Record<string, string | number | undefined> = {};

      // Hanya ambil properti dari query yang relevan dan bisa dikonversi
      Object.keys(req.query).forEach((key) => {
        const value = req.query[key];
        // Hanya ambil string dan number yang valid
        if (typeof value === 'string') {
          // Coba konversi ke number jika mungkin
          const numValue = Number(value);
          if (!isNaN(numValue) && value.trim() !== '') {
            criteria[key] = numValue;
          } else {
            criteria[key] = value;
          }
        } else if (Array.isArray(value) && value.length > 0) {
          // Jika array, ambil nilai pertama saja
          const firstValue = value[0];
          if (typeof firstValue === 'string') {
            const numValue = Number(firstValue);
            if (!isNaN(numValue) && firstValue.trim() !== '') {
              criteria[key] = numValue;
            } else {
              criteria[key] = firstValue;
            }
          }
        }
      });

      console.log('Filtered criteria for risk base search:', criteria);

      const riskBases = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        criteria,
      );

      if (riskBases.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          riskBases,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async createRiskBase(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new RiskBaseInputVM(req.body); // Menggunakan View-Model untuk input
      const resultVM = await this.riskBaseService.createRiskBase(req, vm);
      return this.sendSuccessCreate(
        req,
        res,
        resultVM.result,
        resultVM.result.pkid,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async bulkCreateRiskBases(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      if (!Array.isArray(req.body)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vms = req.body.map((item) => new RiskBaseInputVM(item)); // Membuat array dari View-Model input
      const resultVMs = await this.riskBaseService.bulkCreateRiskBases(
        req,
        vms,
      );
      return this.sendSuccessCreate(
        req,
        res,
        resultVMs.map((vm) => vm.result),
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateRiskBase(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const updateResult = await this.riskBaseService.updateRiskBase(
        req,
        pkid,
        req.body,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async bulkUpdateRiskBases(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const updates = req.body;
      await this.riskBaseService.bulkUpdateRiskBases(req, updates);
      return this.sendSuccessUpdate(req, res, updates);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async softDeleteRiskBase(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.riskBaseService.softDeleteRiskBase(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteRiskBase(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.riskBaseService.hardDeleteRiskBase(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreRiskBase(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.riskBaseService.restoreRiskBase(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // ============================================================================
  // NEW TENANT-BASED METHODS
  // ============================================================================

  /**
   * Check if authenticated tenant has risk bases
   * GET /rm/api/risk-base/tenant/check
   */
  public async checkTenantRiskBasesController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      console.log('🔍 Checking tenant risk bases status');

      const result = await this.riskBaseService.checkTenantRiskBases(req);

      return this.sendSuccessGet(
        req,
        res,
        {
          tenant_id: result.tenantId,
          risk_user: result.riskUser,
          has_risk_bases: result.exists,
          risk_count: result.count,
          message: result.exists
            ? `Tenant has ${result.count} existing risk bases`
            : 'Tenant has no risk bases. Ready for initialization.',
        },
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      console.error('❌ Error checking tenant risk bases:', error);
      return this.handleError(req, res, error, 500);
    }
  }

  /**
   * Initialize default risk bases for authenticated tenant
   * POST /rm/api/risk-base/tenant/initialize
   */
  public async initializeTenantRiskBasesController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      console.log('🚀 Initializing default risk bases for tenant');

      const result =
        await this.riskBaseService.createDefaultRiskBasesForTenant(req);

      if (result.success) {
        return res.status(201).json({
          isSuccess: true,
          message: result.message,
          data: {
            created_count: result.count,
            risk_bases: result.data?.map((vm) => vm.result) || [],
          },
        });
      } else {
        // Business logic error (like duplicate creation)
        return res.status(409).json({
          isSuccess: false,
          message: result.message,
          data: {
            created_count: result.count || 0,
          },
        });
      }
    } catch (error) {
      console.error('❌ Error initializing tenant risk bases:', error);
      return this.handleError(req, res, error, 500);
    }
  }

  /**
   * Get all risk bases for authenticated tenant
   * GET /rm/api/risk-base/tenant
   */
  public async getTenantRiskBasesController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      console.log('📋 Getting tenant risk bases');

      const riskBases = await this.riskBaseService.getTenantRiskBases(req);

      if (riskBases.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          {
            count: riskBases.length,
            risk_bases: riskBases,
          },
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return res.status(200).json({
          isSuccess: true,
          message:
            'No risk bases found for tenant. Use /initialize endpoint to create default risks.',
          data: {
            count: 0,
            risk_bases: [],
          },
        });
      }
    } catch (error) {
      console.error('❌ Error getting tenant risk bases:', error);
      return this.handleError(req, res, error, 500);
    }
  }

  /**
   * Update risk mitigations for authenticated tenant
   * PUT /rm/api/risk-base/tenant/mitigations
   * Body: [{ risk_name: string, risk_mitigation: string }]
   */
  public async updateTenantRiskMitigationsController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      console.log('📝 Updating tenant risk mitigations');

      // Validate request body
      if (!Array.isArray(req.body)) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Request body must be an array of risk mitigation updates',
          data: null,
        });
      }

      // Validate each update item
      const validationErrors: string[] = [];
      req.body.forEach((update, index) => {
        if (!update.risk_name || typeof update.risk_name !== 'string') {
          validationErrors.push(
            `Item ${index}: risk_name is required and must be a string`,
          );
        }
        if (
          !update.risk_mitigation ||
          typeof update.risk_mitigation !== 'string'
        ) {
          validationErrors.push(
            `Item ${index}: risk_mitigation is required and must be a string`,
          );
        }
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Validation failed',
          data: {
            errors: validationErrors,
          },
        });
      }

      const result = await this.riskBaseService.updateTenantRiskMitigations(
        req,
        req.body,
      );

      if (result.success) {
        return res.status(200).json({
          isSuccess: true,
          message: result.message,
          data: {
            updated_count: result.updatedCount,
          },
        });
      } else {
        return res.status(400).json({
          isSuccess: false,
          message: result.message,
          data: {
            updated_count: result.updatedCount,
          },
        });
      }
    } catch (error) {
      console.error('❌ Error updating tenant risk mitigations:', error);
      return this.handleError(req, res, error, 500);
    }
  }

  /**
   * Delete all risk bases for authenticated tenant
   * DELETE /rm/api/risk-base/tenant
   */
  public async deleteTenantRiskBasesController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      console.log('🗑️ Deleting all tenant risk bases');

      const result = await this.riskBaseService.deleteTenantRiskBases(req);

      if (result.success) {
        return res.status(200).json({
          isSuccess: true,
          message: result.message,
          data: {
            deleted_count: result.deletedCount,
          },
        });
      } else {
        return res.status(400).json({
          isSuccess: false,
          message: result.message,
          data: {
            deleted_count: result.deletedCount,
          },
        });
      }
    } catch (error) {
      console.error('❌ Error deleting tenant risk bases:', error);
      return this.handleError(req, res, error, 500);
    }
  }

  /**
   * Force re-initialize risk bases for authenticated tenant
   * POST /rm/api/risk-base/tenant/reinitialize
   * This will delete existing risks and create new defaults
   */
  public async reinitializeTenantRiskBasesController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      console.log('🔄 Re-initializing tenant risk bases');

      // First, delete existing risk bases
      const deleteResult =
        await this.riskBaseService.deleteTenantRiskBases(req);

      if (!deleteResult.success && deleteResult.deletedCount === 0) {
        // No existing risks to delete, proceed with creation
        console.log(
          'ℹ️ No existing risks found, proceeding with initialization',
        );
      } else if (!deleteResult.success) {
        return res.status(500).json({
          isSuccess: false,
          message: `Failed to delete existing risks: ${deleteResult.message}`,
          data: null,
        });
      }

      // Then, create new default risk bases
      const createResult =
        await this.riskBaseService.createDefaultRiskBasesForTenant(req);

      if (createResult.success) {
        return res.status(201).json({
          isSuccess: true,
          message: `Re-initialization successful. Deleted ${deleteResult.deletedCount} existing risks and created ${createResult.count} new defaults.`,
          data: {
            deleted_count: deleteResult.deletedCount,
            created_count: createResult.count,
            risk_bases: createResult.data?.map((vm) => vm.result) || [],
          },
        });
      } else {
        return res.status(500).json({
          isSuccess: false,
          message: `Failed to create new defaults after deletion: ${createResult.message}`,
          data: {
            deleted_count: deleteResult.deletedCount,
            created_count: 0,
          },
        });
      }
    } catch (error) {
      console.error('❌ Error re-initializing tenant risk bases:', error);
      return this.handleError(req, res, error, 500);
    }
  }
}
