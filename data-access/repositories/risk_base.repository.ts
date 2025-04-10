import { Request } from 'express';
import { RiskBaseAttributes } from '../../infrastructure/models/risk_base.model';
import {
  CreationAttributes,
  FindOptions,
  Model,
  WhereOptions,
  Op,
} from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class RiskBaseRepository extends BaseRepository<
  Model<RiskBaseAttributes>
> {
  constructor() {
    super(db.RiskBase);
  }

  async findAll(req: Request): Promise<Model<RiskBaseAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<RiskBaseAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<RiskBaseAttributes>,
    options?: FindOptions<RiskBaseAttributes>,
  ): Promise<Model<RiskBaseAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<RiskBaseAttributes>,
  ): Promise<boolean> {
    const count = await this.model.count({ where: criteria });
    return count > 0;
  }

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<RiskBaseAttributes>>,
  ): Promise<Model<RiskBaseAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<RiskBaseAttributes>>[],
  ): Promise<Model<RiskBaseAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<RiskBaseAttributes>,
  ): Promise<[number, Model<RiskBaseAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<RiskBaseAttributes> }[],
  ): Promise<void> {
    return super.bulkUpdate(req, entities);
  }
  //endregion

  //region Delete & Restore methods
  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    return super.hardDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
  //endregion
}
