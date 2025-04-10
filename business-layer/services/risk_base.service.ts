import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { RiskBaseRepository } from '../../data-access/repositories/risk_base.repository';
import { RiskBaseAttributes } from '../../infrastructure/models/risk_base.model';
import { Model, WhereOptions } from 'sequelize';
import {
  RiskBaseInputVM,
  RiskBaseResultVM,
} from '../../helpers/view-models/risk_base.vm';
import { RiskBaseResultDTO } from '../../helpers/dtos/risk_base.dto';

export class RiskBaseService extends BaseService<Model<RiskBaseAttributes>> {
  constructor() {
    super(new RiskBaseRepository());
  }

  public async findAllRiskBases(
    req: Request,
  ): Promise<Model<RiskBaseAttributes>[]> {
    return await super.findAll(req);
  }

  public async findRiskBaseByID(
    req: Request,
    pkid: number,
  ): Promise<Model<RiskBaseAttributes> | null> {
    return await super.findByPKID(req, pkid);
  }

  public async findRiskBasesByCriteria(
    req: Request,
    criteria: Partial<RiskBaseAttributes>,
  ): Promise<RiskBaseResultDTO[]> {
    const where: WhereOptions<RiskBaseAttributes> = {};
    if (criteria.risk_user) where.risk_user = criteria.risk_user;
    if (criteria.risk_group) where.risk_group = criteria.risk_group;

    const riskBases = await this.where(req, where);
    return await Promise.all(
      riskBases.map((riskBase) => this.convertToResultDTO(riskBase)),
    );
  }

  public async RiskBaseExists(
    req: Request,
    criteria: Partial<RiskBaseAttributes>,
  ): Promise<boolean> {
    return await this.whereExisting(req, criteria);
  }

  private convertToResultDTO(
    model: Model<RiskBaseAttributes>,
  ): RiskBaseResultDTO {
    return model.toJSON();
  }

  public async createRiskBase(
    req: Request,
    vm: RiskBaseInputVM,
  ): Promise<RiskBaseResultVM> {
    const RiskBaseAttributes: Partial<RiskBaseAttributes> = {
      ...vm.RiskBaseData,
    };

    const createdModel = await super.create(
      req,
      RiskBaseAttributes as RiskBaseAttributes,
    );

    if (!(createdModel instanceof Model)) {
      throw new Error('Failed to create KPI Performance');
    }

    const resultDTO = this.convertToResultDTO(createdModel);
    return new RiskBaseResultVM(resultDTO);
  }

  public async bulkCreateRiskBases(
    req: Request,
    vms: RiskBaseInputVM[],
  ): Promise<RiskBaseResultVM[]> {
    const RiskBaseAttributesArray: Partial<RiskBaseAttributes>[] = vms.map(
      (vm) => ({
        ...vm.RiskBaseData,
      }),
    );

    const createdModels = await super.bulkCreate(
      req,
      RiskBaseAttributesArray as RiskBaseAttributes[],
    );

    if (!(createdModels instanceof Array)) {
      throw new Error('Failed to create multiple KPI Performances');
    }

    return createdModels.map(
      (model) => new RiskBaseResultVM(this.convertToResultDTO(model)),
    );
  }

  public async updateRiskBase(
    req: Request,
    pkid: number,
    entity: Partial<RiskBaseAttributes>,
  ): Promise<[number, Model<RiskBaseAttributes>[]]> {
    return await super.update(req, pkid, entity);
  }

  public async bulkUpdateRiskBases(
    req: Request,
    entities: { pkid: number; values: Partial<RiskBaseAttributes> }[],
  ): Promise<void> {
    await super.bulkUpdate(req, entities);
  }

  public async softDeleteRiskBase(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  public async hardDeleteRiskBase(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  public async restoreRiskBase(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
}
