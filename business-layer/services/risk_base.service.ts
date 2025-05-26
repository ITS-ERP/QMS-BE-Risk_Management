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

  /**
   * Menemukan risk bases berdasarkan kriteria yang disediakan
   * @param req Request object
   * @param criteria Kriteria pencarian seperti risk_user, risk_group, tenant_id
   * @returns Array dari RiskBaseResultDTO
   */
  public async findRiskBasesByCriteria(
    req: Request,
    criteria: Record<string, string | number | undefined>,
  ): Promise<RiskBaseResultDTO[]> {
    console.log('Finding risk bases with criteria:', criteria);

    // Bersihkan kriteria dari nilai undefined
    const cleanCriteria: Record<string, string | number> = {};
    for (const key in criteria) {
      if (criteria[key] !== undefined) {
        cleanCriteria[key] = criteria[key] as string | number;
      }
    }

    console.log('Clean criteria:', cleanCriteria);

    // Konstruksi where clause berdasarkan kriteria yang diberikan
    const where: WhereOptions<RiskBaseAttributes> = cleanCriteria;

    // Temukan risk bases berdasarkan kriteria
    const riskBases = await this.where(req, where);
    console.log(`Found ${riskBases.length} risk bases`);

    return await Promise.all(
      riskBases.map((riskBase) => this.convertToResultDTO(riskBase)),
    );
  }

  /**
   * Mencari satu risk base berdasarkan kriteria where
   * @param req Request object
   * @param criteria Kriteria pencarian
   * @returns Model risk base atau null
   */
  public async findOneRiskByCriteria(
    req: Request,
    criteria: Record<string, string | number | undefined>,
  ): Promise<RiskBaseResultDTO | null> {
    console.log('Finding one risk base with criteria:', criteria);

    // Bersihkan kriteria dari nilai undefined
    const cleanCriteria: Record<string, string | number> = {};
    for (const key in criteria) {
      if (criteria[key] !== undefined) {
        cleanCriteria[key] = criteria[key] as string | number;
      }
    }

    // Konstruksi where clause
    const where: WhereOptions<RiskBaseAttributes> = cleanCriteria;

    try {
      // Gunakan where dari BaseService tetapi ambil hanya item pertama
      const riskBases = await this.where(req, where);

      if (!riskBases || riskBases.length === 0) {
        console.log('Risk base not found');
        return null;
      }

      console.log('Risk base found');
      return this.convertToResultDTO(riskBases[0]);
    } catch (error) {
      console.error('Error finding risk base:', error);
      return null;
    }
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
      throw new Error('Failed to create Risk Base');
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

  /**
   * Mencari kode yang sesuai berdasarkan tenant_id
   * @param req Request object
   * @param tenantId ID tenant
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @returns Object dengan pasangan kode (industryCode, supplierCode, retailCode)
   */
  public async findCodesByTenantId(
    req: Request,
    tenantId: string | number,
    riskUser: string,
  ): Promise<{
    industryCode?: string;
    supplierCode?: string;
    retailCode?: string;
  }> {
    const numericTenantId =
      typeof tenantId === 'string'
        ? !isNaN(Number(tenantId))
          ? Number(tenantId)
          : undefined
        : tenantId;

    if (numericTenantId === undefined) {
      console.log(`Invalid tenant_id: ${tenantId}`);
      return {};
    }

    console.log(
      `Searching for codes with tenant_id ${numericTenantId} and user ${riskUser}`,
    );

    // Cari risk bases dengan tenant_id ini
    const criteria = {
      tenant_id: numericTenantId,
      risk_user: riskUser,
    };

    // Gunakan metode yang sudah ada untuk mendapatkan risk base
    const riskBase = await this.findOneRiskByCriteria(req, criteria);

    if (!riskBase) {
      console.log(
        `No risk base found for tenant_id ${tenantId} and user ${riskUser}`,
      );

      // Jika tidak ada data ditemukan, buat kode default berdasarkan tenant_id
      const paddedId = String(numericTenantId).padStart(3, '0');
      if (riskUser.toLowerCase() === 'industry') {
        return { industryCode: `IND-${paddedId}` };
      } else if (riskUser.toLowerCase() === 'supplier') {
        return { supplierCode: `SUP-${paddedId}` };
      } else if (riskUser.toLowerCase() === 'retail') {
        return { retailCode: `RTL-${paddedId}` };
      }

      return {};
    }

    const codes: {
      industryCode?: string;
      supplierCode?: string;
      retailCode?: string;
    } = {};

    // Coba dapatkan kode berdasarkan tipe pengguna
    // Gunakan logika terbaik sesuai struktur data Anda
    try {
      // Logika untuk mengekstrak kode dari riskBase
      // Sesuaikan dengan properti yang tersedia di model RiskBase Anda

      // Contoh implementasi sederhana
      const paddedId = String(numericTenantId).padStart(3, '0');
      if (riskUser.toLowerCase() === 'industry') {
        // Coba dapatkan dari properti yang sesuai, atau gunakan default
        codes.industryCode = `IND-${paddedId}`;
      } else if (riskUser.toLowerCase() === 'supplier') {
        codes.supplierCode = `SUP-${paddedId}`;
      } else if (riskUser.toLowerCase() === 'retail') {
        codes.retailCode = `RTL-${paddedId}`;
      }
    } catch (error) {
      console.error('Error extracting code information:', error);

      // Jika terjadi error, buat kode default
      const paddedId = String(numericTenantId).padStart(3, '0');
      if (riskUser.toLowerCase() === 'industry') {
        codes.industryCode = `IND-${paddedId}`;
      } else if (riskUser.toLowerCase() === 'supplier') {
        codes.supplierCode = `SUP-${paddedId}`;
      } else if (riskUser.toLowerCase() === 'retail') {
        codes.retailCode = `RTL-${paddedId}`;
      }
    }

    console.log(`Found/generated codes for tenant_id ${tenantId}:`, codes);
    return codes;
  }
}
