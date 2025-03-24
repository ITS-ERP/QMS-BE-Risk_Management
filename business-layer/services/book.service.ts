import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { BookRepository } from '../../data-access/repositories/book.repository';
import { BookAttributes } from '../../infrastructure/models/book.model';
import { Model } from 'sequelize';
import { BookInputVM, BookResultVM } from '../../helpers/view-models/book.vm';
import { BookResultDTO } from '../../helpers/dtos/book.dto';
import { isValidISBN } from '../../helpers/utility/validationIsbnBook';

export class BookService extends BaseService<Model<BookAttributes>> {
  constructor() {
    super(new BookRepository());
  }

  async findAllBooks(req: Request): Promise<Model<BookAttributes>[]> {
    return await super.findAll(req);
  }

  async findBookByID(
    req: Request,
    pkid: number,
  ): Promise<Model<BookAttributes> | null> {
    return await super.findByPKID(req, pkid);
  }

  async findBooksByCriteria(
    req: Request,
    criteria: Partial<BookAttributes>,
  ): Promise<Model<BookAttributes>[]> {
    return await this.where(req, criteria);
  }

  async bookExists(
    req: Request,
    criteria: Partial<BookAttributes>,
  ): Promise<boolean> {
    return await this.whereExisting(req, criteria);
  }

  private convertToResultDTO(model: Model<BookAttributes>): BookResultDTO {
    return model.toJSON();
  }

  async createBook(req: Request, vm: BookInputVM): Promise<BookResultVM> {
    if (!isValidISBN(vm.bookData.isbn)) {
      throw new Error('Invalid ISBN format');
    }

    const bookAttributes: Partial<BookAttributes> = {
      ...vm.bookData,
    };

    const createdModel = await super.create(
      req,
      bookAttributes as BookAttributes,
    );

    if (!(createdModel instanceof Model)) {
      throw new Error('Failed to create a book');
    }

    const resultDTO = this.convertToResultDTO(createdModel);
    return new BookResultVM(resultDTO);
  }

  async bulkCreateBooks(
    req: Request,
    vms: BookInputVM[],
  ): Promise<BookResultVM[]> {
    const bookAttributesArray: Partial<BookAttributes>[] = vms.map((vm) => {
      if (!isValidISBN(vm.bookData.isbn)) {
        throw new Error(`Invalid ISBN format for book ${vm.bookData.title}`);
      }
      return {
        ...vm.bookData,
      };
    });

    const createdModels = await super.bulkCreate(
      req,
      bookAttributesArray as BookAttributes[],
    );

    if (!(createdModels instanceof Array)) {
      throw new Error('Failed to create multiple books');
    }

    return createdModels.map(
      (model) => new BookResultVM(this.convertToResultDTO(model)),
    );
  }
  async updateBook(
    req: Request,
    pkid: number,
    entity: Partial<BookAttributes>,
  ): Promise<[number, Model<BookAttributes>[]]> {
    return await super.update(req, pkid, entity);
  }

  async bulkUpdateBooks(
    req: Request,
    entities: { pkid: number; values: Partial<BookAttributes> }[],
  ): Promise<void> {
    await super.bulkUpdate(req, entities);
  }

  async softDeleteBook(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteBook(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreBook(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
}
