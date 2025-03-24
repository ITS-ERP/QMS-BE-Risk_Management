import { Request, Response } from 'express';
import { UserService } from '../../business-layer/services/user.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { UserInputVM } from '../../helpers/view-models/user.vm';

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  public async userExists(req: Request, res: Response): Promise<Response> {
    try {
      const criteria = req.query;
      const exists = await this.userService.userExists(req, criteria);
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

  public async findAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.findAllUsers(req);
      if (users && users.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          users,
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

  public async findUserByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const user = await this.userService.findUserByID(req, pkid);
      if (user) {
        return this.sendSuccessGet(
          req,
          res,
          user,
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

  public async findUsersByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const users = await this.userService.findUsersByCriteria(req, criteria);
      if (users && users.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          users,
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

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new UserInputVM(req.body);
      const resultVM = await this.userService.createUser(req, vm);
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

  public async bulkCreateUsers(req: Request, res: Response): Promise<Response> {
    try {
      if (!Array.isArray(req.body)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vms = req.body.map((item) => new UserInputVM(item));
      const resultVMs = await this.userService.bulkCreateUsers(req, vms);
      return this.sendSuccessCreate(
        req,
        res,
        resultVMs.map((vm) => vm.result),
      ); // Correct handling of a bulk create result
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const updateResult = await this.userService.updateUser(
        req,
        pkid,
        req.body,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async bulkUpdateUsers(req: Request, res: Response): Promise<Response> {
    try {
      const updates = req.body;
      await this.userService.bulkUpdateUsers(req, updates);
      return this.sendSuccessUpdate(req, res, updates);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async softDeleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.userService.softDeleteUser(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.userService.hardDeleteUser(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreUser(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.userService.restoreUser(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
