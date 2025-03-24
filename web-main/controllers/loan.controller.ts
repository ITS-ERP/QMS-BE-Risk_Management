import { Request, Response } from 'express';
import { LoanService } from '../../business-layer/services/loan.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { LoanInputVM } from '../../helpers/view-models/loan.vm';

export class LoanController extends BaseController {
  private loanService: LoanService;

  constructor() {
    super();
    this.loanService = new LoanService();
  }

  public async loanExists(req: Request, res: Response): Promise<Response> {
    try {
      const criteria = req.query;
      const exists = await this.loanService.loanExists(req, criteria);
      return this.sendSuccessGet(
        req,
        res,
        { exists },
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findAllLoans(req: Request, res: Response): Promise<Response> {
    try {
      const loans = await this.loanService.findAllLoans(req);
      if (loans && loans.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          loans,
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

  public async findLoanByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const loan = await this.loanService.findLoanByID(req, pkid);
      if (loan) {
        return this.sendSuccessGet(
          req,
          res,
          loan,
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

  public async findLoansByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const loans = await this.loanService.findLoansByCriteria(req, criteria);
      if (loans && loans.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          loans,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async createLoan(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new LoanInputVM(req.body);
      const resultVM = await this.loanService.createLoan(req, vm);
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

  public async bulkCreateLoans(req: Request, res: Response): Promise<Response> {
    try {
      if (!Array.isArray(req.body)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vms = req.body.map((item) => new LoanInputVM(item));
      const resultVMs = await this.loanService.bulkCreateLoans(req, vms);
      return this.sendSuccessCreate(
        req,
        res,
        resultVMs.map((vm) => vm.result),
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateLoan(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const updateResult = await this.loanService.updateLoan(
        req,
        pkid,
        req.body,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async bulkUpdateLoans(req: Request, res: Response): Promise<Response> {
    try {
      const updates = req.body;
      await this.loanService.bulkUpdateLoans(req, updates);
      return this.sendSuccessUpdate(req, res, updates);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async softDeleteLoan(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.loanService.softDeleteLoan(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteLoan(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.loanService.hardDeleteLoan(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreLoan(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.loanService.restoreLoan(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Additional methods for lending and returning books
  public async lendBook(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new LoanInputVM(req.body);
      const result = await this.loanService.lendBook(req, vm);
      if (typeof result === 'string') {
        return this.sendErrorBadRequest(req, res);
      }
      return this.sendSuccessCreate(
        req,
        res,
        result.result,
        result.result.pkid,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async returnBook(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const result = await this.loanService.returnBook(req, pkid);
      if (typeof result === 'string') {
        return this.sendErrorNotFound(req, res);
      }
      return this.sendSuccessUpdate(req, res, result.result);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
