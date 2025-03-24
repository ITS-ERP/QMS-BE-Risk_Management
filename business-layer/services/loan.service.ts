import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { LoanRepository } from '../../data-access/repositories/loan.repository';
import { LoanAttributes } from '../../infrastructure/models/loan.model';
import { Model } from 'sequelize';
import { LoanInputVM, LoanResultVM } from '../../helpers/view-models/loan.vm';
import { LoanResultDTO } from '../../helpers/dtos/loan.dto';
import { BookRepository } from '../../data-access/repositories/book.repository';
import { StatusLoan } from '../../helpers/enum/statusLoan.enum';

export class LoanService extends BaseService<Model<LoanAttributes>> {
  private loanRepository: LoanRepository;
  private bookRepository: BookRepository;

  constructor() {
    const loanRepo = new LoanRepository();
    const bookRepo = new BookRepository();
    super(loanRepo);
    this.loanRepository = loanRepo;
    this.bookRepository = bookRepo;
  }

  async findAllLoans(req: Request): Promise<Model<LoanAttributes>[]> {
    return await super.findAll(req);
  }

  async findLoanByID(
    req: Request,
    pkid: number,
  ): Promise<Model<LoanAttributes> | null> {
    return await super.findByPKID(req, pkid);
  }

  async findLoansByCriteria(
    req: Request,
    criteria: Partial<LoanAttributes>,
  ): Promise<Model<LoanAttributes>[]> {
    return await this.where(req, criteria);
  }

  async loanExists(
    req: Request,
    criteria: Partial<LoanAttributes>,
  ): Promise<boolean> {
    return await this.whereExisting(req, criteria);
  }

  private convertToResultDTO(model: Model<LoanAttributes>): LoanResultDTO {
    return model.toJSON();
  }

  async createLoan(req: Request, vm: LoanInputVM): Promise<LoanResultVM> {
    const loanAttributes: Partial<LoanAttributes> = {
      ...vm.loanData,
      status: StatusLoan.Borrowed,
    };

    const createdModel = await super.create(
      req,
      loanAttributes as LoanAttributes,
    );

    if (!(createdModel instanceof Model)) {
      throw new Error('Failed to create a loan');
    }

    const resultDTO = this.convertToResultDTO(createdModel);
    return new LoanResultVM(resultDTO);
  }

  async bulkCreateLoans(
    req: Request,
    vms: LoanInputVM[],
  ): Promise<LoanResultVM[]> {
    const loanAttributesArray: Partial<LoanAttributes>[] = vms.map((vm) => ({
      ...vm.loanData,
      status: StatusLoan.Borrowed, // Use StatusLoan enum
    }));

    const createdModels = await super.bulkCreate(
      req,
      loanAttributesArray as LoanAttributes[],
    );

    if (!(createdModels instanceof Array)) {
      throw new Error('Failed to create multiple loans');
    }

    return createdModels.map(
      (model) => new LoanResultVM(this.convertToResultDTO(model)),
    );
  }

  async updateLoan(
    req: Request,
    pkid: number,
    entity: Partial<LoanAttributes>,
  ): Promise<[number, Model<LoanAttributes>[]]> {
    return await super.update(req, pkid, entity);
  }

  async bulkUpdateLoans(
    req: Request,
    entities: { pkid: number; values: Partial<LoanAttributes> }[],
  ): Promise<void> {
    await super.bulkUpdate(req, entities);
  }

  async softDeleteLoan(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteLoan(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreLoan(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }

  async lendBook(
    req: Request,
    vm: LoanInputVM,
  ): Promise<LoanResultVM | string> {
    const loanAttributes: Partial<LoanAttributes> = {
      ...vm.loanData,
      status: StatusLoan.Borrowed,
    };

    const bookId = loanAttributes.book_id!;
    const book = await this.bookRepository.findByID(req, bookId);

    if (!book) {
      return 'Book not found';
    }

    const availableCopies = book.getDataValue('available_copies') as number;
    if (availableCopies <= 0) {
      return 'No copies available for lending';
    }

    await book.update({ available_copies: availableCopies - 1 });

    const result = await super.create(req, loanAttributes as LoanAttributes);

    if (!(result instanceof Model)) {
      return 'Failed to create a loan';
    }

    return new LoanResultVM(this.convertToResultDTO(result));
  }

  async returnBook(req: Request, pkid: number): Promise<LoanResultVM | string> {
    const loan = await this.loanRepository.findByID(req, pkid);

    if (!loan || loan.getDataValue('status') !== StatusLoan.Borrowed) {
      return 'Loan not found or already returned';
    }

    loan.setDataValue('status', StatusLoan.Returned);
    loan.setDataValue('return_date', new Date());
    await loan.save();

    const bookId = loan.getDataValue('book_id');
    const book = await this.bookRepository.findByID(req, bookId);

    if (book) {
      const availableCopies = book.getDataValue('available_copies') as number;
      await book.update({ available_copies: availableCopies + 1 });
    }

    return new LoanResultVM(this.convertToResultDTO(loan));
  }
}
