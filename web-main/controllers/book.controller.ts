import { Request, Response } from 'express';
import { BookService } from '../../business-layer/services/book.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { BookInputVM } from '../../helpers/view-models/book.vm';

export class BookController extends BaseController {
  private bookService: BookService;

  constructor() {
    super();
    this.bookService = new BookService();
  }

  public async bookExists(req: Request, res: Response): Promise<Response> {
    try {
      const criteria = req.query;
      const exists = await this.bookService.bookExists(req, criteria);
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

  public async findAllBooks(req: Request, res: Response): Promise<Response> {
    try {
      const books = await this.bookService.findAllBooks(req);
      if (books && books.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          books,
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

  public async findBookByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const book = await this.bookService.findBookByID(req, pkid);
      if (book) {
        return this.sendSuccessGet(
          req,
          res,
          book,
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

  public async findBooksByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const books = await this.bookService.findBooksByCriteria(req, criteria);
      if (books && books.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          books,
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

  public async createBook(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new BookInputVM(req.body);
      const resultVM = await this.bookService.createBook(req, vm);
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

  public async bulkCreateBooks(req: Request, res: Response): Promise<Response> {
    try {
      if (!Array.isArray(req.body)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vms = req.body.map((item) => new BookInputVM(item));
      const resultVMs = await this.bookService.bulkCreateBooks(req, vms);
      return this.sendSuccessCreate(
        req,
        res,
        resultVMs.map((vm) => vm.result),
      ); // Modified to correctly format the result
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateBook(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const updateResult = await this.bookService.updateBook(
        req,
        pkid,
        req.body,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async bulkUpdateBooks(req: Request, res: Response): Promise<Response> {
    try {
      const updates = req.body;
      await this.bookService.bulkUpdateBooks(req, updates);
      return this.sendSuccessUpdate(req, res, updates);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async softDeleteBook(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.bookService.softDeleteBook(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteBook(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.bookService.hardDeleteBook(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreBook(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.bookService.restoreBook(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
