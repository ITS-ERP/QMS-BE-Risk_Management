import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { UserAttributes } from '../../infrastructure/models/user.model';
import { Model } from 'sequelize';
import { UserInputVM, UserResultVM } from '../../helpers/view-models/user.vm';
import { UserResultDTO } from '../../helpers/dtos/user.dto';

export class UserService extends BaseService<Model<UserAttributes>> {
  constructor() {
    super(new UserRepository());
  }

  async findAllUsers(req: Request): Promise<Model<UserAttributes>[]> {
    return await super.findAll(req);
  }

  async findUserByID(
    req: Request,
    pkid: number,
  ): Promise<Model<UserAttributes> | null> {
    return await super.findByPKID(req, pkid);
  }

  async findUsersByCriteria(
    req: Request,
    criteria: Partial<UserAttributes>,
  ): Promise<Model<UserAttributes>[]> {
    return await this.where(req, criteria);
  }

  async userExists(
    req: Request,
    criteria: Partial<UserAttributes>,
  ): Promise<boolean> {
    return await this.whereExisting(req, criteria);
  }

  private convertToResultDTO(model: Model<UserAttributes>): UserResultDTO {
    return model.toJSON();
  }

  async createUser(req: Request, vm: UserInputVM): Promise<UserResultVM> {
    const userAttributes: Partial<UserAttributes> = {
      ...vm.userData,
    };

    const createdModel = await super.create(
      req,
      userAttributes as UserAttributes,
    );

    if (!(createdModel instanceof Model)) {
      throw new Error('Failed to create a user');
    }

    const resultDTO = this.convertToResultDTO(createdModel);
    return new UserResultVM(resultDTO);
  }

  async bulkCreateUsers(
    req: Request,
    vms: UserInputVM[],
  ): Promise<UserResultVM[]> {
    const userAttributesArray: Partial<UserAttributes>[] = vms.map((vm) => ({
      ...vm.userData,
    }));

    const createdModels = await super.bulkCreate(
      req,
      userAttributesArray as UserAttributes[],
    );

    if (!(createdModels instanceof Array)) {
      throw new Error('Failed to create multiple users');
    }

    return createdModels.map(
      (model) => new UserResultVM(this.convertToResultDTO(model)),
    );
  }

  async updateUser(
    req: Request,
    pkid: number,
    entity: Partial<UserAttributes>,
  ): Promise<[number, Model<UserAttributes>[]]> {
    return await super.update(req, pkid, entity);
  }

  async bulkUpdateUsers(
    req: Request,
    entities: { pkid: number; values: Partial<UserAttributes> }[],
  ): Promise<void> {
    await super.bulkUpdate(req, entities);
  }

  async softDeleteUser(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteUser(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreUser(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
}
