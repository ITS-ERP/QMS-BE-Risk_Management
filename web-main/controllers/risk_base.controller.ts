import { Request, Response } from 'express';
import { RiskBaseService } from '../../business-layer/services/risk_base.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { RiskBaseInputVM } from '../../helpers/view-models/risk_base.vm';
import { RiskBaseAttributes } from '../../infrastructure/models/risk_base.model';

export class RiskBaseController extends BaseController {
  private riskBaseService: RiskBaseService;

  constructor() {
    super();
    this.riskBaseService = new RiskBaseService();
  }

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
      const criteria = req.query;
      const riskBases = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        criteria as Partial<RiskBaseAttributes>,
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
}
