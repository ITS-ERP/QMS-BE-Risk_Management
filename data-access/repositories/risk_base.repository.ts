import { Request } from 'express';
import { RiskBaseAttributes } from '../../infrastructure/models/risk_base.model';
import {
  CreationAttributes,
  FindOptions,
  Model,
  WhereOptions,
  Transaction,
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

  /**
   * Check if risk bases already exist for specific tenant and risk_user
   * @param req Request object
   * @param tenantId Tenant ID
   * @param riskUser Risk user type (Industry, Supplier, Retail)
   * @returns Promise<boolean>
   */
  async checkExistingByTenantAndRiskUser(
    req: Request,
    tenantId: number,
    riskUser: string,
  ): Promise<boolean> {
    try {
      const count = await this.model.count({
        where: {
          tenant_id: tenantId,
          risk_user: riskUser,
          is_deleted: false, // Only check non-deleted records
        },
      });

      console.log(
        `📊 Found ${count} existing risk bases for tenant ${tenantId} and risk_user ${riskUser}`,
      );

      return count > 0;
    } catch (error) {
      console.error('Error checking existing risk bases:', error);
      return false;
    }
  }

  /**
   * Get count of existing risk bases by tenant and risk_user
   * @param req Request object
   * @param tenantId Tenant ID
   * @param riskUser Risk user type
   * @returns Promise<number>
   */
  async getCountByTenantAndRiskUser(
    req: Request,
    tenantId: number,
    riskUser: string,
  ): Promise<number> {
    try {
      const count = await this.model.count({
        where: {
          tenant_id: tenantId,
          risk_user: riskUser,
          is_deleted: false,
        },
      });

      return count;
    } catch (error) {
      console.error('Error getting count of risk bases:', error);
      return 0;
    }
  }

  /**
   * Find all risk bases for specific tenant and risk_user
   * @param req Request object
   * @param tenantId Tenant ID
   * @param riskUser Risk user type
   * @returns Promise<Model<RiskBaseAttributes>[]>
   */
  async findByTenantAndRiskUser(
    req: Request,
    tenantId: number,
    riskUser: string,
  ): Promise<Model<RiskBaseAttributes>[]> {
    try {
      const riskBases = await this.model.findAll({
        where: {
          tenant_id: tenantId,
          risk_user: riskUser,
          is_deleted: false,
        },
        order: [
          ['risk_group', 'ASC'],
          ['risk_name', 'ASC'],
        ],
      });

      console.log(
        `📋 Found ${riskBases.length} risk bases for tenant ${tenantId} and risk_user ${riskUser}`,
      );

      return riskBases;
    } catch (error) {
      console.error('Error finding risk bases by tenant and risk_user:', error);
      return [];
    }
  }

  /**
   * Bulk create risk bases with enhanced error handling
   * @param req Request object
   * @param entities Array of risk base entities to create
   * @returns Promise<Model<RiskBaseAttributes>[] | string>
   */
  async bulkCreateWithValidation(
    req: Request,
    entities: CreationAttributes<Model<RiskBaseAttributes>>[],
  ): Promise<Model<RiskBaseAttributes>[] | string> {
    try {
      console.log(`🚀 Starting bulk creation of ${entities.length} risk bases`);

      // Validate that all entities have required fields
      const validationErrors: string[] = [];
      entities.forEach((entity, index) => {
        if (!entity.risk_name) {
          validationErrors.push(`Entity ${index}: risk_name is required`);
        }
        if (!entity.risk_user) {
          validationErrors.push(`Entity ${index}: risk_user is required`);
        }
        if (!entity.tenant_id) {
          validationErrors.push(`Entity ${index}: tenant_id is required`);
        }
      });

      if (validationErrors.length > 0) {
        const errorMessage = `Validation failed: ${validationErrors.join(', ')}`;
        console.error('❌ Bulk create validation failed:', errorMessage);
        return errorMessage;
      }

      // Use transaction for bulk insert
      const result = await db.sequelize.transaction(
        async (transaction: Transaction) => {
          return await this.model.bulkCreate(entities, {
            transaction,
            validate: true,
            returning: true,
          });
        },
      );

      console.log(`✅ Successfully bulk created ${result.length} risk bases`);
      return result;
    } catch (error) {
      console.error('❌ Error in bulk create with validation:', error);

      if (error instanceof Error) {
        return `Bulk create failed: ${error.message}`;
      }

      return 'Bulk create failed: Unknown error';
    }
  }

  /**
   * Delete all risk bases for specific tenant and risk_user (soft delete)
   * @param req Request object
   * @param tenantId Tenant ID
   * @param riskUser Risk user type
   * @returns Promise<number> Number of affected rows
   */
  async softDeleteByTenantAndRiskUser(
    req: Request,
    tenantId: number,
    riskUser: string,
  ): Promise<number> {
    try {
      const updateValues: Partial<RiskBaseAttributes> = {
        is_deleted: true,
        deleted_by: req.body.deleted_by || 'system',
        deleted_date: new Date(),
        deleted_host: req.ip || 'unknown',
      };

      const [affectedRows] = await this.model.update(updateValues, {
        where: {
          tenant_id: tenantId,
          risk_user: riskUser,
          is_deleted: false,
        },
      });

      console.log(
        `🗑️ Soft deleted ${affectedRows} risk bases for tenant ${tenantId} and risk_user ${riskUser}`,
      );

      return affectedRows;
    } catch (error) {
      console.error('Error in soft delete by tenant and risk_user:', error);
      return 0;
    }
  }

  /**
   * Restore all risk bases for specific tenant and risk_user
   * @param req Request object
   * @param tenantId Tenant ID
   * @param riskUser Risk user type
   * @returns Promise<number> Number of affected rows
   */
  async restoreByTenantAndRiskUser(
    req: Request,
    tenantId: number,
    riskUser: string,
  ): Promise<number> {
    try {
      const updateValues: Partial<RiskBaseAttributes> = {
        is_deleted: false,
        deleted_by: undefined,
        deleted_date: undefined,
        deleted_host: undefined,
        updated_by: req.body.updated_by || 'system',
        updated_date: new Date(),
        updated_host: req.ip || 'unknown',
      };

      const [affectedRows] = await this.model.update(updateValues, {
        where: {
          tenant_id: tenantId,
          risk_user: riskUser,
          is_deleted: true,
        },
      });

      console.log(
        `♻️ Restored ${affectedRows} risk bases for tenant ${tenantId} and risk_user ${riskUser}`,
      );

      return affectedRows;
    } catch (error) {
      console.error('Error in restore by tenant and risk_user:', error);
      return 0;
    }
  }

  /**
   * Find risk bases with duplicate risk_name for same tenant and risk_user
   * @param req Request object
   * @param tenantId Tenant ID
   * @param riskUser Risk user type
   * @returns Promise<Model<RiskBaseAttributes>[]>
   */
  async findDuplicatesByTenantAndRiskUser(
    req: Request,
    tenantId: number,
    riskUser: string,
  ): Promise<Model<RiskBaseAttributes>[]> {
    try {
      const duplicates = await this.model.findAll({
        where: {
          tenant_id: tenantId,
          risk_user: riskUser,
          is_deleted: false,
        },
        attributes: [
          'risk_name',
          [db.sequelize.fn('COUNT', db.sequelize.col('risk_name')), 'count'],
        ],
        group: ['risk_name'],
        having: db.sequelize.where(
          db.sequelize.fn('COUNT', db.sequelize.col('risk_name')),
          '>',
          1,
        ),
      });

      console.log(
        `🔍 Found ${duplicates.length} duplicate risk names for tenant ${tenantId} and risk_user ${riskUser}`,
      );

      return duplicates;
    } catch (error) {
      console.error('Error finding duplicates:', error);
      return [];
    }
  }

  /**
   * Update risk_mitigation for multiple risk bases by tenant and risk_user
   * @param req Request object
   * @param tenantId Tenant ID
   * @param riskUser Risk user type
   * @param updates Array of {risk_name, risk_mitigation} updates
   * @returns Promise<number> Number of affected rows
   */
  async bulkUpdateMitigationByTenantAndRiskUser(
    req: Request,
    tenantId: number,
    riskUser: string,
    updates: Array<{ risk_name: string; risk_mitigation: string }>,
  ): Promise<number> {
    try {
      let totalAffectedRows = 0;

      // Use transaction for bulk updates
      await db.sequelize.transaction(async (transaction: Transaction) => {
        for (const update of updates) {
          const updateValues: Partial<RiskBaseAttributes> = {
            risk_mitigation: update.risk_mitigation,
            updated_by: req.body.updated_by || 'system',
            updated_date: new Date(),
            updated_host: req.ip || 'unknown',
          };

          const [affectedRows] = await this.model.update(updateValues, {
            where: {
              tenant_id: tenantId,
              risk_user: riskUser,
              risk_name: update.risk_name,
              is_deleted: false,
            },
            transaction,
          });

          totalAffectedRows += affectedRows;
        }
      });

      console.log(
        `📝 Updated ${totalAffectedRows} risk mitigations for tenant ${tenantId} and risk_user ${riskUser}`,
      );

      return totalAffectedRows;
    } catch (error) {
      console.error('Error in bulk update mitigation:', error);
      return 0;
    }
  }

  //region Original methods (unchanged)
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
