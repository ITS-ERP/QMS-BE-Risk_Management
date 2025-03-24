import { Request } from 'express';
import { UserAttributes } from '../../infrastructure/models/user.model';
import { Model, CreationAttributes, WhereOptions } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class UserRepository extends BaseRepository<Model<UserAttributes>> {
  constructor() {
    super(db.User);
  }

  async findAll(req: Request): Promise<Model<UserAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<UserAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<UserAttributes>,
  ): Promise<Model<UserAttributes>[]> {
    return super.where(req, criteria);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<UserAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }

  async create(
    req: Request,
    entity: CreationAttributes<Model<UserAttributes>>,
  ): Promise<Model<UserAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<UserAttributes>>[],
  ): Promise<Model<UserAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }

  async update(
    req: Request,
    pkid: number,
    entity: Partial<UserAttributes>,
  ): Promise<[number, Model<UserAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<UserAttributes> }[],
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
