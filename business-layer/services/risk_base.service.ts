import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { RiskBaseRepository } from '../../data-access/repositories/risk_base.repository';
import { RiskBaseAttributes } from '../../infrastructure/models/risk_base.model';
import { Model, WhereOptions, CreationAttributes } from 'sequelize';
import {
  RiskBaseInputVM,
  RiskBaseResultVM,
} from '../../helpers/view-models/risk_base.vm';
import { RiskBaseResultDTO } from '../../helpers/dtos/risk_base.dto';
import { getQMSContext } from '../../data-access/utility/requestHelper';
import * as userManagementIntegration from '../../data-access/integrations/userManagement.integration';

// Type definition for risk base creation (without auto-generated fields)
type RiskBaseCreationData = Omit<
  RiskBaseAttributes,
  | 'pkid'
  | 'created_by'
  | 'created_date'
  | 'created_host'
  | 'updated_by'
  | 'updated_date'
  | 'updated_host'
  | 'is_deleted'
  | 'deleted_by'
  | 'deleted_date'
  | 'deleted_host'
>;
const DEFAULT_RISK_TEMPLATES = {
  Industry: [
    {
      risk_name: 'Ketidaksesuaian Jumlah (Received Items)',
      risk_desc: 'Ketidaksesuaian jumlah item yang diterima oleh Industri',
      risk_group: 'Inventory',
      risk_mitigation: 'Verifikasi ulang jumlah saat penerimaan barang',
    },
    {
      risk_name: 'Ketidaksesuaian Jumlah (Transferred Items)',
      risk_desc: 'Ketidaksesuaian jumlah item yang dikirimkan ke pembeli',
      risk_group: 'Inventory',
      risk_mitigation: 'Verifikasi ulang jumlah saat pengiriman barang',
    },
    {
      risk_name: 'Produk Cacat',
      risk_desc: 'Produk yang dihasilkan tidak sesuai dengan standar kualitas',
      risk_group: 'Manufacturing',
      risk_mitigation: 'Peningkatan pengawasan kualitas produksi',
    },
    {
      risk_name: 'Keterlambatan RFQ',
      risk_desc:
        'Keterlambatan proses RFQ dalam rentang waktu purchase request ke pembuatan RFQ',
      risk_group: 'SRM Procurement',
      risk_mitigation: 'Peningkatan komunikasi dengan supplier',
    },
    {
      risk_name: 'Penerimaan terlambat',
      risk_desc: 'Ketidaktepatan waktu penerimaan bahan baku dari Supplier',
      risk_group: 'SRM Contract',
      risk_mitigation: 'Pengetatan jadwal pengiriman',
    },
    {
      risk_name: 'Jumlah diterima tidak sesuai',
      risk_desc:
        'Ketidaksesuaian jumlah bahan baku yang diterima dari Supplier',
      risk_group: 'SRM Contract',
      risk_mitigation: 'Peningkatan inspeksi',
    },
    {
      risk_name: 'Penolakan LoR',
      risk_desc: 'Penolakan Letter of Requests oleh Industri',
      risk_group: 'CRM Requisition',
      risk_mitigation: 'Evaluasi ulang LoR',
    },
    {
      risk_name: 'Penolakan LoA',
      risk_desc: 'Supplier menolak Letter of Agreements dari Industri',
      risk_group: 'CRM Requisition',
      risk_mitigation: 'Evaluasi ulang LoA',
    },
    {
      risk_name: 'Penurunan jumlah kontrak',
      risk_desc: 'Penurunan jumlah kontrak yang terjalin dengan Retail',
      risk_group: 'CRM Contract',
      risk_mitigation: 'Peningkatan jumlah kontrak',
    },
    {
      risk_name: 'Pengiriman terlambat',
      risk_desc: 'Ketidaktepatan waktu pengiriman produk dari Industri',
      risk_group: 'CRM Contract',
      risk_mitigation: 'Pengetatan jadwal pengiriman',
    },
    {
      risk_name: 'Jumlah dikirim tidak sesuai',
      risk_desc: 'Ketidaksesuaian jumlah produk yang dikirim oleh Industri',
      risk_group: 'CRM Contract',
      risk_mitigation: 'Peningkatan inspeksi',
    },
  ],
  Supplier: [
    {
      risk_name: 'Kekalahan pada proses RFQ',
      risk_desc:
        'Kekalahan Supplier pada proses procurement (RFQ) yang diselenggarakan Industri',
      risk_group: 'Procurement',
      risk_mitigation: 'Peningkatan kualitas RFQ',
    },
    {
      risk_name: 'Penurunan jumlah kontrak',
      risk_desc: 'Penurunan jumlah kontrak yang terjalin dengan Industri',
      risk_group: 'Contract',
      risk_mitigation: 'Peningkatan jumlah kontrak',
    },
    {
      risk_name: 'Pengiriman terlambat',
      risk_desc: 'Ketidaktepatan waktu pengiriman bahan baku oleh Supplier',
      risk_group: 'Contract',
      risk_mitigation: 'Pengetatan jadwal pengiriman',
    },
    {
      risk_name: 'Jumlah dikirim tidak sesuai',
      risk_desc: 'Ketidaksesuaian jumlah bahan baku yang dikirim oleh Supplier',
      risk_group: 'Contract',
      risk_mitigation: 'Peningkatan inspeksi',
    },
    {
      risk_name: 'Tidak lolos cek kebersihan',
      risk_desc: 'Bahan baku yang dikirim oleh Supplier dalam kondisi kotor',
      risk_group: 'Inspection',
      risk_mitigation: 'Pengetatan proses inspeksi',
    },
    {
      risk_name: 'Tidak lolos cek brix',
      risk_desc:
        'Bahan baku yang dikirim oleh Supplier memiliki nilai brix kurang dari 13',
      risk_group: 'Inspection',
      risk_mitigation: 'Pengetatan proses inspeksi',
    },
  ],
  Retail: [
    {
      risk_name: 'Penolakan LoR',
      risk_desc: 'Industri menolak Letter of Request dari Supplier',
      risk_group: 'Requisition',
      risk_mitigation: 'Evaluasi ulang LoR',
    },
    {
      risk_name: 'Penolakan LoA',
      risk_desc: 'Penolakan Letter of Agreements oleh Supplier',
      risk_group: 'Requisition',
      risk_mitigation: 'Evaluasi ulang LoA',
    },
    {
      risk_name: 'Penerimaan terlambat',
      risk_desc: 'Ketidaktepatan waktu penerimaan produk dari Industri',
      risk_group: 'Contract',
      risk_mitigation: 'Pengetatan jadwal pengiriman',
    },
    {
      risk_name: 'Jumlah diterima tidak sesuai',
      risk_desc: 'Ketidaksesuaian jumlah produk yang diterima dari Industri',
      risk_group: 'Contract',
      risk_mitigation: 'Peningkatan inspeksi',
    },
  ],
};

export class RiskBaseService extends BaseService<Model<RiskBaseAttributes>> {
  private riskBaseRepository: RiskBaseRepository;

  constructor() {
    super(new RiskBaseRepository());
    this.riskBaseRepository = new RiskBaseRepository();
  }

  // ============================================================================
  // ORIGINAL METHODS (Unchanged)
  // ============================================================================

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
      throw new Error('Failed to create multiple Risk Bases');
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

  // ============================================================================
  // NEW TENANT-BASED METHODS
  // ============================================================================

  /**
   * Get tenant information from User Management API
   * @param req Request object with authentication
   * @returns Tenant info with type
   */
  private async getTenantInfo(req: Request): Promise<{
    tenant_id: number;
    tenant_type: string;
  } | null> {
    try {
      const context = getQMSContext(req);
      const tenantId = context.tenant_id_string;

      console.log(`🔍 Getting tenant info for tenant_id: ${tenantId}`);

      const response = await userManagementIntegration.getTenantByTenantId(
        req,
        tenantId,
      );

      if (!response.data || !response.data.data) {
        console.error('❌ No tenant data found');
        return null;
      }

      const tenantData = response.data.data;
      const tenantType = tenantData.type || tenantData.tenant_type;

      console.log(
        `✅ Tenant info retrieved: ID=${tenantId}, Type=${tenantType}`,
      );

      return {
        tenant_id: context.tenant_id_number,
        tenant_type: tenantType,
      };
    } catch (error) {
      console.error('❌ Error getting tenant info:', error);
      return null;
    }
  }

  /**
   * Map tenant type to risk_user
   * @param tenantType Tenant type from User Management
   * @returns Risk user type
   */
  private mapTenantTypeToRiskUser(tenantType: string): string {
    const normalizedType = tenantType.toLowerCase();

    if (
      normalizedType.includes('industry') ||
      normalizedType.includes('industri')
    ) {
      return 'Industry';
    } else if (normalizedType.includes('supplier')) {
      return 'Supplier';
    } else if (normalizedType.includes('retail')) {
      return 'Retail';
    }

    // Default fallback
    console.warn(
      `⚠️ Unknown tenant type: ${tenantType}, defaulting to Industry`,
    );
    return 'Industry';
  }

  /**
   * Check if tenant already has risk bases
   * @param req Request object
   * @returns Promise<{exists: boolean, count: number, riskUser: string}>
   */
  public async checkTenantRiskBases(req: Request): Promise<{
    exists: boolean;
    count: number;
    riskUser: string;
    tenantId: number;
  }> {
    try {
      const tenantInfo = await this.getTenantInfo(req);
      if (!tenantInfo) {
        throw new Error('Unable to get tenant information');
      }

      const riskUser = this.mapTenantTypeToRiskUser(tenantInfo.tenant_type);
      const exists =
        await this.riskBaseRepository.checkExistingByTenantAndRiskUser(
          req,
          tenantInfo.tenant_id,
          riskUser,
        );

      const count = await this.riskBaseRepository.getCountByTenantAndRiskUser(
        req,
        tenantInfo.tenant_id,
        riskUser,
      );

      console.log(
        `📊 Tenant ${tenantInfo.tenant_id} (${riskUser}): exists=${exists}, count=${count}`,
      );

      return {
        exists,
        count,
        riskUser,
        tenantId: tenantInfo.tenant_id,
      };
    } catch (error) {
      console.error('❌ Error checking tenant risk bases:', error);
      throw error;
    }
  }

  /**
   * Create default risk bases for authenticated tenant
   * @param req Request object with authentication
   * @returns Promise<RiskBaseResultVM[]>
   */
  public async createDefaultRiskBasesForTenant(req: Request): Promise<{
    success: boolean;
    message: string;
    data?: RiskBaseResultVM[];
    count?: number;
  }> {
    try {
      console.log('🚀 Starting default risk bases creation for tenant');

      // Check if tenant already has risk bases
      const tenantCheck = await this.checkTenantRiskBases(req);

      if (tenantCheck.exists) {
        return {
          success: false,
          message: `Tenant already has ${tenantCheck.count} risk bases. Cannot create duplicates.`,
          count: tenantCheck.count,
        };
      }

      // Get risk templates for tenant type
      const riskTemplates =
        DEFAULT_RISK_TEMPLATES[
          tenantCheck.riskUser as keyof typeof DEFAULT_RISK_TEMPLATES
        ];

      if (!riskTemplates || riskTemplates.length === 0) {
        return {
          success: false,
          message: `No risk templates found for risk user type: ${tenantCheck.riskUser}`,
        };
      }

      console.log(
        `📋 Creating ${riskTemplates.length} default risks for ${tenantCheck.riskUser}`,
      );

      // Prepare risk base entities with tenant_id and risk_user
      const riskBaseEntities: RiskBaseCreationData[] = riskTemplates.map(
        (template) => ({
          ...template,
          risk_user: tenantCheck.riskUser,
          tenant_id: tenantCheck.tenantId,
        }),
      );

      // Bulk create using repository method (cast to expected type)
      const result = await this.riskBaseRepository.bulkCreateWithValidation(
        req,
        riskBaseEntities as CreationAttributes<Model<RiskBaseAttributes>>[],
      );

      if (typeof result === 'string') {
        // Error occurred
        return {
          success: false,
          message: result,
        };
      }

      // Convert to result VMs
      const resultVMs = result.map(
        (model) => new RiskBaseResultVM(this.convertToResultDTO(model)),
      );

      console.log(
        `✅ Successfully created ${resultVMs.length} default risk bases`,
      );

      return {
        success: true,
        message: `Successfully created ${resultVMs.length} default risk bases for ${tenantCheck.riskUser}`,
        data: resultVMs,
        count: resultVMs.length,
      };
    } catch (error) {
      console.error('❌ Error creating default risk bases:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get risk bases for authenticated tenant
   * @param req Request object with authentication
   * @returns Promise<RiskBaseResultDTO[]>
   */
  public async getTenantRiskBases(req: Request): Promise<RiskBaseResultDTO[]> {
    try {
      const tenantCheck = await this.checkTenantRiskBases(req);

      const riskBases = await this.riskBaseRepository.findByTenantAndRiskUser(
        req,
        tenantCheck.tenantId,
        tenantCheck.riskUser,
      );

      return riskBases.map((model) => this.convertToResultDTO(model));
    } catch (error) {
      console.error('❌ Error getting tenant risk bases:', error);
      throw error;
    }
  }

  /**
   * Update risk mitigations for tenant
   * @param req Request object with authentication
   * @param updates Array of risk mitigation updates
   * @returns Promise<{success: boolean, message: string, updatedCount: number}>
   */
  public async updateTenantRiskMitigations(
    req: Request,
    updates: Array<{ risk_name: string; risk_mitigation: string }>,
  ): Promise<{
    success: boolean;
    message: string;
    updatedCount: number;
  }> {
    try {
      console.log(`📝 Updating ${updates.length} risk mitigations for tenant`);

      const tenantCheck = await this.checkTenantRiskBases(req);

      if (!tenantCheck.exists) {
        return {
          success: false,
          message:
            'No risk bases found for tenant. Please create default risks first.',
          updatedCount: 0,
        };
      }

      const updatedCount =
        await this.riskBaseRepository.bulkUpdateMitigationByTenantAndRiskUser(
          req,
          tenantCheck.tenantId,
          tenantCheck.riskUser,
          updates,
        );

      console.log(`✅ Updated ${updatedCount} risk mitigations`);

      return {
        success: true,
        message: `Successfully updated ${updatedCount} risk mitigations`,
        updatedCount,
      };
    } catch (error) {
      console.error('❌ Error updating risk mitigations:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        updatedCount: 0,
      };
    }
  }

  /**
   * Delete all risk bases for tenant (soft delete)
   * @param req Request object with authentication
   * @returns Promise<{success: boolean, message: string, deletedCount: number}>
   */
  public async deleteTenantRiskBases(req: Request): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      console.log('🗑️ Deleting all risk bases for tenant');

      const tenantCheck = await this.checkTenantRiskBases(req);

      if (!tenantCheck.exists) {
        return {
          success: false,
          message: 'No risk bases found for tenant',
          deletedCount: 0,
        };
      }

      const deletedCount =
        await this.riskBaseRepository.softDeleteByTenantAndRiskUser(
          req,
          tenantCheck.tenantId,
          tenantCheck.riskUser,
        );

      console.log(`✅ Deleted ${deletedCount} risk bases`);

      return {
        success: true,
        message: `Successfully deleted ${deletedCount} risk bases`,
        deletedCount,
      };
    } catch (error) {
      console.error('❌ Error deleting risk bases:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        deletedCount: 0,
      };
    }
  }

  // ============================================================================
  // LEGACY METHOD (Updated)
  // ============================================================================

  /**
   * Mencari kode yang sesuai berdasarkan tenant_id (Legacy method - updated)
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
    try {
      const paddedId = String(numericTenantId).padStart(3, '0');
      if (riskUser.toLowerCase() === 'industry') {
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
