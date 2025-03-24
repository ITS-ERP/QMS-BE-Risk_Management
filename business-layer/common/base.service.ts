import { Request } from 'express';
import { Model, CreationAttributes, WhereOptions } from 'sequelize';
import { BaseRepository } from '../../data-access/utility/base.repository';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export abstract class BaseService<T extends Model> {
  repository: BaseRepository<T>;

  protected constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  //region Error Handling

  /**
   * General method to handle errors, can be overridden for specific service behavior.
   */
  protected handleError(req: Request, error: any): never {
    let errorMessage = getMessage(req, MessagesKey.INTERNALSERVERERROR);
    if (error instanceof Error) {
      errorMessage += ': ' + error.message;
    } else {
      errorMessage = getMessage(req, MessagesKey.UNKNOWNERROR);
    }
    throw new Error(errorMessage);
  }

  //endregion

  //region Find methods

  /**
   * Retrieves all instances.
   */
  async findAll(req: Request): Promise<T[]> {
    try {
      return await this.repository.findAll(req);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  /**
   * Finds an instance by its primary key ID.
   */
  async findByPKID(req: Request, pkid: number): Promise<T | null> {
    try {
      return await this.repository.findByID(req, pkid);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  /**
   * Finds instances that match the given criteria.
   */
  async where(
    req: Request,
    criteria: WhereOptions<T['_attributes']>,
  ): Promise<T[]> {
    try {
      return await this.repository.where(req, criteria);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  /**
   * Checks if there exists an instance that matches the given criteria.
   */
  async whereExisting(
    req: Request,
    criteria: Partial<T['_attributes']>,
  ): Promise<boolean> {
    try {
      return await this.repository.whereExisting(req, criteria);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  //endregion

  //region Create methods

  /**
   * Create a new instance.
   */
  async create(
    req: Request,
    entity: CreationAttributes<T>,
  ): Promise<T | string> {
    try {
      return await this.repository.create(req, entity);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  /**
   * Bulk creates instances.
   */
  async bulkCreate(
    req: Request,
    entities: CreationAttributes<T>[],
  ): Promise<T[] | string> {
    try {
      return await this.repository.bulkCreate(req, entities);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  //endregion

  //region Update methods

  /**
   * Updates an existing instance.
   */
  async update(
    req: Request,
    pkid: number,
    entity: Partial<T['_attributes']>,
  ): Promise<[number, T[]]> {
    try {
      return await this.repository.update(req, pkid, entity);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  /**
   * Bulk updates instances.
   */
  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<T['_attributes']> }[],
  ): Promise<void> {
    try {
      return await this.repository.bulkUpdate(req, entities);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  //endregion

  //region Delete and Restore methods

  /**
   * Softly deletes an existing instance by its primary key ID.
   */
  async softDelete(req: Request, pkid: number): Promise<void> {
    try {
      await this.repository.softDelete(req, pkid);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  /**
   * Permanently deletes an existing instance by its primary key ID.
   */
  async hardDelete(req: Request, pkid: number): Promise<void> {
    try {
      await this.repository.hardDelete(req, pkid);
    } catch (error) {
      this.handleError(req, error);
    }
  }

  /**
   * Restores a previously deleted instance by its primary key ID.
   */
  async restore(req: Request, pkid: number): Promise<void> {
    try {
      await this.repository.restore(req, pkid);
    } catch (error) {
      this.handleError(req, error);
    }
  }
  //endregion
}
