import { Request } from 'express';
import { LoanAttributes } from '../../infrastructure/models/loan.model';
import { Model, CreationAttributes, WhereOptions } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class LoanRepository extends BaseRepository<Model<LoanAttributes>> {
  constructor() {
    super(db.Loan);
  }

  async findAll(req: Request): Promise<Model<LoanAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<LoanAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<LoanAttributes>,
  ): Promise<Model<LoanAttributes>[]> {
    return super.where(req, criteria);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<LoanAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }

  async create(
    req: Request,
    entity: CreationAttributes<Model<LoanAttributes>>,
  ): Promise<Model<LoanAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<LoanAttributes>>[],
  ): Promise<Model<LoanAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }

  async update(
    req: Request,
    pkid: number,
    entity: Partial<LoanAttributes>,
  ): Promise<[number, Model<LoanAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<LoanAttributes> }[],
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
