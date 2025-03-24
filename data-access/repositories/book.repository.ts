import { Request } from 'express';
import { BookAttributes } from '../../infrastructure/models/book.model';
import { Model, CreationAttributes, WhereOptions } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class BookRepository extends BaseRepository<Model<BookAttributes>> {
  constructor() {
    super(db.Book);
  }

  async findAll(req: Request): Promise<Model<BookAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<BookAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<BookAttributes>,
  ): Promise<Model<BookAttributes>[]> {
    return super.where(req, criteria);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<BookAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }

  async create(
    req: Request,
    entity: CreationAttributes<Model<BookAttributes>>,
  ): Promise<Model<BookAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<BookAttributes>>[],
  ): Promise<Model<BookAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }

  async update(
    req: Request,
    pkid: number,
    entity: Partial<BookAttributes>,
  ): Promise<[number, Model<BookAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<BookAttributes> }[],
  ): Promise<void> {
    return super.bulkUpdate(req, entities);
  }

  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    return super.hardDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
}
