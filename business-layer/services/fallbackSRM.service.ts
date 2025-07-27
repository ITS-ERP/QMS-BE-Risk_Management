import { Op } from 'sequelize';

// Import SRM Database Models
import {
  Supplier,
  srmSupplierPortalDB,
} from '../../rabbit/external/srmSupplierPortalDB';

import {
  RFQ,
  DirectRFQ,
  RFQParticipant,
  BidItem,
  SupplierProcurement,
  Industry,
  SupplierItem,
  BidItemWinner,
  SupplierOffer,
  srmProcurementDB,
} from '../../rabbit/external/srmProcurementDB';

import {
  MasterContract,
  DetailContract,
  HistoryShipment,
  RequestedPeriodicShipment,
  DetailContractPeriodicShipment,
  RelationOfContract,
  AcceptedPeriodicShipment,
  srmContractDB,
} from '../../rabbit/external/srmContractDB';

// ================================
// SRM SUPPLIER PORTAL FALLBACK FUNCTIONS
// ================================

export const fallbackGetSupplierByTenantIdFromSRMDB = async (
  tenantId: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting supplier by tenant ID ${tenantId} from SRM Supplier Portal DB`,
    );

    // Connect to SRM Supplier Portal database
    await srmSupplierPortalDB.authenticate();

    // Find supplier by tenant_id
    const supplier = await Supplier.findOne({
      where: {
        tenant_id: tenantId,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    if (!supplier) {
      console.log(
        `⚠️ [Fallback SRM] No supplier found for tenant ID ${tenantId}`,
      );
      return null;
    }

    const supplierData = supplier.toJSON();

    console.log(
      `✅ [Fallback SRM] Found supplier: ${supplierData.name} for tenant ID ${tenantId}`,
    );

    return supplierData;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting supplier by tenant ID ${tenantId}:`,
      error,
    );
    throw new Error(`Failed to get supplier by tenant ID: ${error}`);
  }
};
// ================================
// SRM PROCUREMENT FALLBACK FUNCTIONS
// ================================

export const fallbackGetAllRFQsFromSRMDB = async (criteria?: any) => {
  try {
    console.log(`🔄 [Fallback SRM] Getting all RFQs from SRM Procurement DB`);

    await srmProcurementDB.authenticate();

    const whereClause: any = {
      is_deleted: {
        [Op.or]: [false, null],
      },
    };

    // Apply criteria if provided
    if (criteria) {
      if (criteria.status) whereClause.status = criteria.status;
      if (criteria.type) whereClause.type = criteria.type;
      if (criteria.industry_pkid)
        whereClause.industry_pkid = criteria.industry_pkid;
    }

    const rfqs = await RFQ.findAll({
      where: whereClause,
      order: [['created_date', 'DESC']],
    });

    const rfqsData = rfqs.map((rfq) => rfq.toJSON());

    console.log(`✅ [Fallback SRM] Found ${rfqsData.length} RFQs`);

    return rfqsData;
  } catch (error) {
    console.error(`❌ [Fallback SRM] Error getting all RFQs:`, error);
    throw new Error(`Failed to get all RFQs: ${error}`);
  }
};

export const fallbackGetAllDirectRFQsFromSRMDB = async (criteria?: any) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting all Direct RFQs from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const whereClause: any = {
      is_deleted: {
        [Op.or]: [false, null],
      },
    };

    // Apply criteria if provided
    if (criteria) {
      if (criteria.status) whereClause.status = criteria.status;
      if (criteria.industry_pkid)
        whereClause.industry_pkid = criteria.industry_pkid;
      if (criteria.supplier_pkid)
        whereClause.supplier_pkid = criteria.supplier_pkid;
    }

    const directRfqs = await DirectRFQ.findAll({
      where: whereClause,
      order: [['created_date', 'DESC']],
    });

    const directRfqsData = directRfqs.map((rfq) => rfq.toJSON());

    console.log(`✅ [Fallback SRM] Found ${directRfqsData.length} Direct RFQs`);

    return directRfqsData;
  } catch (error) {
    console.error(`❌ [Fallback SRM] Error getting all Direct RFQs:`, error);
    throw new Error(`Failed to get all Direct RFQs: ${error}`);
  }
};

export const fallbackGetRFQsByIndustryIdFromSRMDB = async (
  industryId: number,
  criteria?: any,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting RFQs by Industry ID ${industryId} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const whereClause: any = {
      industry_pkid: industryId,
      is_deleted: {
        [Op.or]: [false, null],
      },
    };

    // Apply additional criteria if provided
    if (criteria) {
      if (criteria.status) whereClause.status = criteria.status;
      if (criteria.type) whereClause.type = criteria.type;
    }

    const rfqs = await RFQ.findAll({
      where: whereClause,
      order: [['created_date', 'DESC']],
    });

    const rfqsData = rfqs.map((rfq) => rfq.toJSON());

    console.log(
      `✅ [Fallback SRM] Found ${rfqsData.length} RFQs for Industry ${industryId}`,
    );

    return rfqsData;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting RFQs by Industry ID:`,
      error,
    );
    throw new Error(`Failed to get RFQs by Industry ID: ${error}`);
  }
};

export const fallbackGetDirectRFQsByIndustryIdFromSRMDB = async (
  industryId: number,
  criteria?: any,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Direct RFQs by Industry ID ${industryId} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const whereClause: any = {
      industry_pkid: industryId,
      is_deleted: {
        [Op.or]: [false, null],
      },
    };

    // Apply additional criteria if provided
    if (criteria) {
      if (criteria.status) whereClause.status = criteria.status;
    }

    const directRfqs = await DirectRFQ.findAll({
      where: whereClause,
      order: [['created_date', 'DESC']],
    });

    const directRfqsData = directRfqs.map((rfq) => rfq.toJSON());

    console.log(
      `✅ [Fallback SRM] Found ${directRfqsData.length} Direct RFQs for Industry ${industryId}`,
    );

    return directRfqsData;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Direct RFQs by Industry ID:`,
      error,
    );
    throw new Error(`Failed to get Direct RFQs by Industry ID: ${error}`);
  }
};

export const fallbackGetRFQWinningItemCountByRFQIdFromSRMDB = async (
  rfqPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting RFQ Winning Item Count for RFQ ${rfqPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    // Get bid items for this RFQ
    const bidItems = await BidItem.findAll({
      where: {
        rfq_pkid: rfqPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    // Count winning items (bid items that have winners)
    let winningItemCount = 0;
    for (const bidItem of bidItems) {
      const winners = await BidItemWinner.findAll({
        where: {
          bid_item_pkid: bidItem.get('pkid'),
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      if (winners.length > 0) {
        winningItemCount++;
      }
    }

    const result = {
      rfq_pkid: rfqPkid,
      total_bid_items: bidItems.length,
      winning_items: winningItemCount,
    };

    console.log(
      `✅ [Fallback SRM] Found ${winningItemCount} winning items out of ${bidItems.length} total items for RFQ ${rfqPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting RFQ Winning Item Count:`,
      error,
    );
    throw new Error(`Failed to get RFQ Winning Item Count: ${error}`);
  }
};

export const fallbackGetWinningOffersByParticipantIdFromSRMDB = async (
  rfqParticipantPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Winning Offers for Participant ${rfqParticipantPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    // Get all supplier offers for this participant
    const supplierOffers = await SupplierOffer.findAll({
      where: {
        rfq_participant_pkid: rfqParticipantPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    // Check which offers are winners
    const winningOffers = [];
    for (const offer of supplierOffers) {
      const winner = await BidItemWinner.findOne({
        where: {
          supplier_offer_pkid: offer.get('pkid'),
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      if (winner) {
        winningOffers.push({
          ...offer.toJSON(),
          winner_details: winner.toJSON(),
        });
      }
    }

    console.log(
      `✅ [Fallback SRM] Found ${winningOffers.length} winning offers for Participant ${rfqParticipantPkid}`,
    );

    return winningOffers;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Winning Offers by Participant:`,
      error,
    );
    throw new Error(`Failed to get Winning Offers by Participant: ${error}`);
  }
};

export const fallbackGetRFQsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
  criteria?: any,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting RFQs by Supplier ID ${supplierPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    // Get RFQ participants for this supplier
    const participants = await RFQParticipant.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const rfqIds = participants.map((p) => p.get('rfq_pkid'));

    if (rfqIds.length === 0) {
      return [];
    }

    const whereClause: any = {
      pkid: {
        [Op.in]: rfqIds,
      },
      is_deleted: {
        [Op.or]: [false, null],
      },
    };

    // Apply additional criteria if provided
    if (criteria) {
      if (criteria.status) whereClause.status = criteria.status;
      if (criteria.type) whereClause.type = criteria.type;
    }

    const rfqs = await RFQ.findAll({
      where: whereClause,
      order: [['created_date', 'DESC']],
    });

    const rfqsData = rfqs.map((rfq) => rfq.toJSON());

    console.log(
      `✅ [Fallback SRM] Found ${rfqsData.length} RFQs for Supplier ${supplierPkid}`,
    );

    return rfqsData;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting RFQs by Supplier ID:`,
      error,
    );
    throw new Error(`Failed to get RFQs by Supplier ID: ${error}`);
  }
};

export const fallbackGetDirectRFQsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
  criteria?: any,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Direct RFQs by Supplier ID ${supplierPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const whereClause: any = {
      supplier_pkid: supplierPkid,
      is_deleted: {
        [Op.or]: [false, null],
      },
    };

    // Apply additional criteria if provided
    if (criteria) {
      if (criteria.status) whereClause.status = criteria.status;
    }

    const directRfqs = await DirectRFQ.findAll({
      where: whereClause,
      order: [['created_date', 'DESC']],
    });

    const directRfqsData = directRfqs.map((rfq) => rfq.toJSON());

    console.log(
      `✅ [Fallback SRM] Found ${directRfqsData.length} Direct RFQs for Supplier ${supplierPkid}`,
    );

    return directRfqsData;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Direct RFQs by Supplier ID:`,
      error,
    );
    throw new Error(`Failed to get Direct RFQs by Supplier ID: ${error}`);
  }
};

export const fallbackGetTotalRFQByStatusByIndustryIdFromSRMDB = async (
  industryId: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total RFQ by Status for Industry ${industryId} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const rfqs = await RFQ.findAll({
      where: {
        industry_pkid: industryId,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['status'],
    });

    // Group by status and count
    const statusCounts = rfqs.reduce((acc: any, rfq: any) => {
      const status = rfq.get('status');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format
    const result = Object.entries(statusCounts).map(([status, total]) => ({
      status,
      total,
    }));

    console.log(
      `✅ [Fallback SRM] Found RFQ status breakdown for Industry ${industryId}:`,
      result,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total RFQ by Status by Industry:`,
      error,
    );
    throw new Error(`Failed to get Total RFQ by Status by Industry: ${error}`);
  }
};

export const fallbackGetTotalRFQByStatusBySupplierIdFromSRMDB = async (
  supplierPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total RFQ by Status for Supplier ${supplierPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    // Get RFQ participants for this supplier
    const participants = await RFQParticipant.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const rfqIds = participants.map((p) => p.get('rfq_pkid'));

    if (rfqIds.length === 0) {
      return [];
    }

    const rfqs = await RFQ.findAll({
      where: {
        pkid: {
          [Op.in]: rfqIds,
        },
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['status'],
    });

    // Group by status and count
    const statusCounts = rfqs.reduce((acc: any, rfq: any) => {
      const status = rfq.get('status');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format
    const result = Object.entries(statusCounts).map(([status, total]) => ({
      status,
      total,
    }));

    console.log(
      `✅ [Fallback SRM] Found RFQ status breakdown for Supplier ${supplierPkid}:`,
      result,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total RFQ by Status by Supplier:`,
      error,
    );
    throw new Error(`Failed to get Total RFQ by Status by Supplier: ${error}`);
  }
};

export const fallbackGetTotalDirectRFQByStatusByIndustryIdFromSRMDB = async (
  industryPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total Direct RFQ by Status for Industry ${industryPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const directRfqs = await DirectRFQ.findAll({
      where: {
        industry_pkid: industryPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['status'],
    });

    // Group by status and count
    const statusCounts = directRfqs.reduce((acc: any, rfq: any) => {
      const status = rfq.get('status');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format
    const result = Object.entries(statusCounts).map(([status, total]) => ({
      status,
      total,
    }));

    console.log(
      `✅ [Fallback SRM] Found Direct RFQ status breakdown for Industry ${industryPkid}:`,
      result,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total Direct RFQ by Status by Industry:`,
      error,
    );
    throw new Error(
      `Failed to get Total Direct RFQ by Status by Industry: ${error}`,
    );
  }
};

export const fallbackGetTotalDirectRFQByStatusBySupplierIdFromSRMDB = async (
  supplierPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total Direct RFQ by Status for Supplier ${supplierPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const directRfqs = await DirectRFQ.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['status'],
    });

    // Group by status and count
    const statusCounts = directRfqs.reduce((acc: any, rfq: any) => {
      const status = rfq.get('status');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format
    const result = Object.entries(statusCounts).map(([status, total]) => ({
      status,
      total,
    }));

    console.log(
      `✅ [Fallback SRM] Found Direct RFQ status breakdown for Supplier ${supplierPkid}:`,
      result,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total Direct RFQ by Status by Supplier:`,
      error,
    );
    throw new Error(
      `Failed to get Total Direct RFQ by Status by Supplier: ${error}`,
    );
  }
};
// ================================
// SRM PROCUREMENT FALLBACK FUNCTIONS (CONTINUED)
// ================================

export const fallbackGetTotalRFQLastYearsByIndustryIdFromSRMDB = async (
  industryPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total RFQ Last Years for Industry ${industryPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const rfqs = await RFQ.findAll({
        where: {
          industry_pkid: industryPkid,
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: rfqs.length,
        rfqs: rfqs.map((rfq) => rfq.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found RFQ data for ${range} years for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total RFQ Last Years by Industry:`,
      error,
    );
    throw new Error(`Failed to get Total RFQ Last Years by Industry: ${error}`);
  }
};

export const fallbackGetTotalRFQLastYearsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total RFQ Last Years for Supplier ${supplierPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    // Get all participants for this supplier
    const participants = await RFQParticipant.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const rfqIds = participants.map((p) => p.get('rfq_pkid'));

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const rfqs = await RFQ.findAll({
        where: {
          pkid: {
            [Op.in]: rfqIds,
          },
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: rfqs.length,
        rfqs: rfqs.map((rfq) => rfq.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found RFQ data for ${range} years for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total RFQ Last Years by Supplier:`,
      error,
    );
    throw new Error(`Failed to get Total RFQ Last Years by Supplier: ${error}`);
  }
};

export const fallbackGetTotalDirectRFQLastYearsByIndustryIdFromSRMDB = async (
  industryPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total Direct RFQ Last Years for Industry ${industryPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const directRfqs = await DirectRFQ.findAll({
        where: {
          industry_pkid: industryPkid,
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: directRfqs.length,
        rfqs: directRfqs.map((rfq) => rfq.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found Direct RFQ data for ${range} years for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total Direct RFQ Last Years by Industry:`,
      error,
    );
    throw new Error(
      `Failed to get Total Direct RFQ Last Years by Industry: ${error}`,
    );
  }
};

export const fallbackGetTotalDirectRFQLastYearsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total Direct RFQ Last Years for Supplier ${supplierPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const directRfqs = await DirectRFQ.findAll({
        where: {
          supplier_pkid: supplierPkid,
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: directRfqs.length,
        rfqs: directRfqs.map((rfq) => rfq.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found Direct RFQ data for ${range} years for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total Direct RFQ Last Years by Supplier:`,
      error,
    );
    throw new Error(
      `Failed to get Total Direct RFQ Last Years by Supplier: ${error}`,
    );
  }
};

export const fallbackGetWinningRFQsBySupplierInDateRangeFromSRMDB = async (
  supplierPkid: number,
  startDate: string,
  endDate: string,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Winning RFQs for Supplier ${supplierPkid} in Date Range from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get participants for this supplier
    const participants = await RFQParticipant.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const winningRfqs = [];
    for (const participant of participants) {
      // Check if this participant has winning offers
      const offers = await SupplierOffer.findAll({
        where: {
          rfq_participant_pkid: participant.get('pkid'),
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      for (const offer of offers) {
        const winner = await BidItemWinner.findOne({
          where: {
            supplier_offer_pkid: offer.get('pkid'),
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        });

        if (winner) {
          // Get the RFQ details
          const rfq = await RFQ.findOne({
            where: {
              pkid: participant.get('rfq_pkid'),
              rfq_start_date: {
                [Op.between]: [start, end],
              },
              is_deleted: {
                [Op.or]: [false, null],
              },
            },
          });

          if (rfq) {
            winningRfqs.push(rfq.toJSON());
          }
          break; // Don't add the same RFQ multiple times
        }
      }
    }

    // ✅ FIXED: Group by year and format like SRM API response
    const yearlyGrouped = winningRfqs.reduce((acc: any, rfq: any) => {
      const year = new Date(rfq.rfq_start_date).getFullYear();

      if (!acc[year]) {
        acc[year] = {
          year,
          total: 0,
          rfqs: [],
        };
      }

      acc[year].total++;
      acc[year].rfqs.push(rfq);
      return acc;
    }, {});

    // Convert to array format
    const result = Object.values(yearlyGrouped).sort(
      (a: any, b: any) => b.year - a.year,
    );

    console.log(
      `✅ [Fallback SRM] Found ${winningRfqs.length} winning RFQs grouped into ${result.length} years for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Winning RFQs by Supplier:`,
      error,
    );
    throw new Error(`Failed to get Winning RFQs by Supplier: ${error}`);
  }
};

export const fallbackGetLostRFQsBySupplierInDateRangeFromSRMDB = async (
  supplierPkid: number,
  startDate: string,
  endDate: string,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Lost RFQs for Supplier ${supplierPkid} in Date Range from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get participants for this supplier
    const participants = await RFQParticipant.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const lostRfqs = [];
    for (const participant of participants) {
      // Check if this participant has any offers
      const offers = await SupplierOffer.findAll({
        where: {
          rfq_participant_pkid: participant.get('pkid'),
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      let hasWinningOffer = false;
      for (const offer of offers) {
        const winner = await BidItemWinner.findOne({
          where: {
            supplier_offer_pkid: offer.get('pkid'),
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        });

        if (winner) {
          hasWinningOffer = true;
          break;
        }
      }

      // If participated but no winning offers, it's a lost RFQ
      if (offers.length > 0 && !hasWinningOffer) {
        const rfq = await RFQ.findOne({
          where: {
            pkid: participant.get('rfq_pkid'),
            rfq_start_date: {
              [Op.between]: [start, end],
            },
            status: 'Ended', // Only count completed RFQs
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        });

        if (rfq) {
          lostRfqs.push(rfq.toJSON());
        }
      }
    }

    // ✅ FIXED: Group by year and format like SRM API response
    const yearlyGrouped = lostRfqs.reduce((acc: any, rfq: any) => {
      const year = new Date(rfq.rfq_start_date).getFullYear();

      if (!acc[year]) {
        acc[year] = {
          year,
          total: 0,
          rfqs: [],
        };
      }

      acc[year].total++;
      acc[year].rfqs.push(rfq);
      return acc;
    }, {});

    // Convert to array format
    const result = Object.values(yearlyGrouped).sort(
      (a: any, b: any) => b.year - a.year,
    );

    console.log(
      `✅ [Fallback SRM] Found ${lostRfqs.length} lost RFQs grouped into ${result.length} years for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Lost RFQs by Supplier:`,
      error,
    );
    throw new Error(`Failed to get Lost RFQs by Supplier: ${error}`);
  }
};

export const fallbackGetAcceptedDirectRFQsByIndustryInRangeFromSRMDB = async (
  industryPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Accepted Direct RFQs for Industry ${industryPkid} in Range from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const acceptedDirectRfqs = await DirectRFQ.findAll({
        where: {
          industry_pkid: industryPkid,
          status: 'Accepted',
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: acceptedDirectRfqs.length,
        rfqs: acceptedDirectRfqs.map((rfq) => rfq.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found Accepted Direct RFQ data for ${range} years for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Accepted Direct RFQs by Industry:`,
      error,
    );
    throw new Error(`Failed to get Accepted Direct RFQs by Industry: ${error}`);
  }
};

export const fallbackGetRejectedDirectRFQsByIndustryInRangeFromSRMDB = async (
  industryPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Rejected Direct RFQs for Industry ${industryPkid} in Range from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const rejectedDirectRfqs = await DirectRFQ.findAll({
        where: {
          industry_pkid: industryPkid,
          status: 'Rejected',
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: rejectedDirectRfqs.length,
        rfqs: rejectedDirectRfqs.map((rfq) => rfq.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found Rejected Direct RFQ data for ${range} years for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Rejected Direct RFQs by Industry:`,
      error,
    );
    throw new Error(`Failed to get Rejected Direct RFQs by Industry: ${error}`);
  }
};

export const fallbackGetAllRFQParticipantsByRFQIdFromSRMDB = async (
  rfqPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting All RFQ Participants for RFQ ${rfqPkid} from SRM Procurement DB`,
    );

    await srmProcurementDB.authenticate();

    const participants = await RFQParticipant.findAll({
      where: {
        rfq_pkid: rfqPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      order: [['registration_date', 'DESC']],
    });

    const participantsData = participants.map((participant) =>
      participant.toJSON(),
    );

    console.log(
      `✅ [Fallback SRM] Found ${participantsData.length} participants for RFQ ${rfqPkid}`,
    );

    return participantsData;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting All RFQ Participants by RFQ ID:`,
      error,
    );
    throw new Error(`Failed to get All RFQ Participants by RFQ ID: ${error}`);
  }
};

// ================================
// SRM CONTRACT FALLBACK FUNCTIONS
// ================================

export const fallbackGetAllContractsByIndustryIdFromSRMDB = async (
  industryPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting All Contracts for Industry ${industryPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // ✅ SIMPLE APPROACH: Get master contracts first, then get details separately
    const masterContracts = await MasterContract.findAll({
      where: {
        industry_pkid: industryPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      order: [['created_date', 'DESC']],
    });

    console.log(
      `📊 Found ${masterContracts.length} master contracts for Industry ${industryPkid}`,
    );

    // ✅ For each master contract, get its detail contracts separately
    const contractsWithDetails = await Promise.all(
      masterContracts.map(async (masterContract) => {
        const masterData = masterContract.toJSON();

        try {
          // Get detail contracts for this master contract
          const detailContracts = await DetailContract.findAll({
            where: {
              master_contract_pkid: masterData.pkid,
              is_deleted: {
                [Op.or]: [false, null],
              },
            },
          });

          // For each detail contract, get its shipments separately
          const detailsWithShipments = await Promise.all(
            detailContracts.map(async (detailContract) => {
              const detailData = detailContract.toJSON();

              try {
                // Get history shipments
                const historyShipments = await HistoryShipment.findAll({
                  where: {
                    detail_contract_pkid: detailData.pkid,
                    is_deleted: {
                      [Op.or]: [false, null],
                    },
                  },
                });

                // Get requested periodic shipments
                const requestedPeriodicShipments =
                  await RequestedPeriodicShipment.findAll({
                    where: {
                      detail_contract_pkid: detailData.pkid,
                      is_deleted: {
                        [Op.or]: [false, null],
                      },
                    },
                  });

                return {
                  ...detailData,
                  historyShipments: historyShipments.map((ship) =>
                    ship.toJSON(),
                  ),
                  requestedPeriodicShipments: requestedPeriodicShipments.map(
                    (req) => req.toJSON(),
                  ),
                };
              } catch (shipmentError) {
                console.log(
                  `⚠️ Error getting shipments for detail contract ${detailData.pkid}:`,
                  shipmentError,
                );
                return {
                  ...detailData,
                  historyShipments: [],
                  requestedPeriodicShipments: [],
                };
              }
            }),
          );

          return {
            ...masterData,
            detailContracts: detailsWithShipments,
          };
        } catch (detailError) {
          console.log(
            `⚠️ Error getting detail contracts for master ${masterData.pkid}:`,
            detailError,
          );
          return {
            ...masterData,
            detailContracts: [],
          };
        }
      }),
    );

    console.log(
      `✅ [Fallback SRM] Successfully processed ${contractsWithDetails.length} contracts for Industry ${industryPkid}`,
    );

    return contractsWithDetails;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting All Contracts by Industry ID:`,
      error,
    );
    throw new Error(`Failed to get All Contracts by Industry ID: ${error}`);
  }
};

export const fallbackGetAllContractsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting All Contracts for Supplier ${supplierPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // ✅ SIMPLE APPROACH: Get master contracts first, then get details separately
    const masterContracts = await MasterContract.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      order: [['created_date', 'DESC']],
    });

    console.log(
      `📊 Found ${masterContracts.length} master contracts for Supplier ${supplierPkid}`,
    );

    // ✅ For each master contract, get its detail contracts separately
    const contractsWithDetails = await Promise.all(
      masterContracts.map(async (masterContract) => {
        const masterData = masterContract.toJSON();

        try {
          // Get detail contracts for this master contract
          const detailContracts = await DetailContract.findAll({
            where: {
              master_contract_pkid: masterData.pkid,
              is_deleted: {
                [Op.or]: [false, null],
              },
            },
          });

          // For each detail contract, get its shipments separately
          const detailsWithShipments = await Promise.all(
            detailContracts.map(async (detailContract) => {
              const detailData = detailContract.toJSON();

              try {
                // Get history shipments
                const historyShipments = await HistoryShipment.findAll({
                  where: {
                    detail_contract_pkid: detailData.pkid,
                    is_deleted: {
                      [Op.or]: [false, null],
                    },
                  },
                });

                // Get requested periodic shipments
                const requestedPeriodicShipments =
                  await RequestedPeriodicShipment.findAll({
                    where: {
                      detail_contract_pkid: detailData.pkid,
                      is_deleted: {
                        [Op.or]: [false, null],
                      },
                    },
                  });

                return {
                  ...detailData,
                  historyShipments: historyShipments.map((ship) =>
                    ship.toJSON(),
                  ),
                  requestedPeriodicShipments: requestedPeriodicShipments.map(
                    (req) => req.toJSON(),
                  ),
                };
              } catch (shipmentError) {
                console.log(
                  `⚠️ Error getting shipments for detail contract ${detailData.pkid}:`,
                  shipmentError,
                );
                return {
                  ...detailData,
                  historyShipments: [],
                  requestedPeriodicShipments: [],
                };
              }
            }),
          );

          return {
            ...masterData,
            detailContracts: detailsWithShipments,
          };
        } catch (detailError) {
          console.log(
            `⚠️ Error getting detail contracts for master ${masterData.pkid}:`,
            detailError,
          );
          return {
            ...masterData,
            detailContracts: [],
          };
        }
      }),
    );

    console.log(
      `✅ [Fallback SRM] Successfully processed ${contractsWithDetails.length} contracts for Supplier ${supplierPkid}`,
    );

    return contractsWithDetails;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting All Contracts by Supplier ID:`,
      error,
    );
    throw new Error(`Failed to get All Contracts by Supplier ID: ${error}`);
  }
};

export const fallbackGetTopSuppliersByIndustryIdFromSRMDB = async (
  industryPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Top Suppliers for Industry ${industryPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // Get all contracts for this industry and group by supplier
    const contracts = await MasterContract.findAll({
      where: {
        industry_pkid: industryPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['supplier_pkid'],
    });

    // Count contracts per supplier
    const supplierCounts = contracts.reduce((acc: any, contract: any) => {
      const supplierId = contract.get('supplier_pkid');
      acc[supplierId] = (acc[supplierId] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort by count
    const result = Object.entries(supplierCounts)
      .map(([supplier_pkid, detail_contract_count]) => ({
        supplier_pkid: parseInt(supplier_pkid),
        detail_contract_count,
      }))
      .sort(
        (a: any, b: any) => b.detail_contract_count - a.detail_contract_count,
      )
      .slice(0, 10); // Top 10

    console.log(
      `✅ [Fallback SRM] Found top ${result.length} suppliers for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Top Suppliers by Industry ID:`,
      error,
    );
    throw new Error(`Failed to get Top Suppliers by Industry ID: ${error}`);
  }
};

export const fallbackGetTopIndustriesBySupplierIdFromSRMDB = async (
  supplierPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Top Industries for Supplier ${supplierPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // Get all contracts for this supplier and group by industry
    const contracts = await MasterContract.findAll({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['industry_pkid'],
    });

    // Count contracts per industry
    const industryCounts = contracts.reduce((acc: any, contract: any) => {
      const industryId = contract.get('industry_pkid');
      acc[industryId] = (acc[industryId] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort by count
    const result = Object.entries(industryCounts)
      .map(([industry_pkid, detail_contract_count]) => ({
        industry_pkid: parseInt(industry_pkid),
        detail_contract_count,
      }))
      .sort(
        (a: any, b: any) => b.detail_contract_count - a.detail_contract_count,
      )
      .slice(0, 10); // Top 10

    console.log(
      `✅ [Fallback SRM] Found top ${result.length} industries for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Top Industries by Supplier ID:`,
      error,
    );
    throw new Error(`Failed to get Top Industries by Supplier ID: ${error}`);
  }
};

export const fallbackGetTopIndustryItemsByIndustryIdFromSRMDB = async (
  industryPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Top Industry Items for Industry ${industryPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // Get detail contracts for this industry
    const detailContracts = await DetailContract.findAll({
      include: [
        {
          model: MasterContract,
          as: 'masterContract',
          where: {
            industry_pkid: industryPkid,
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
          attributes: [],
        },
      ],
      where: {
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['industry_item_pkid', 'target_grand_total'],
    });

    // Group by industry item and sum grand totals
    const itemTotals = detailContracts.reduce((acc: any, detail: any) => {
      const itemId = detail.get('industry_item_pkid');
      const total = parseFloat(detail.get('target_grand_total') || '0');
      acc[itemId] = (acc[itemId] || 0) + total;
      return acc;
    }, {});

    // Convert to array and sort by total
    const result = Object.entries(itemTotals)
      .map(([industry_item_pkid, total_actual_grand_total]) => ({
        industry_item_pkid: parseInt(industry_item_pkid),
        total_actual_grand_total: (
          total_actual_grand_total as number
        ).toString(),
      }))
      .sort(
        (a: any, b: any) =>
          parseFloat(b.total_actual_grand_total) -
          parseFloat(a.total_actual_grand_total),
      )
      .slice(0, 10); // Top 10

    console.log(
      `✅ [Fallback SRM] Found top ${result.length} industry items for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Top Industry Items by Industry ID:`,
      error,
    );
    throw new Error(
      `Failed to get Top Industry Items by Industry ID: ${error}`,
    );
  }
};

export const fallbackGetTopSupplierItemsByIndustryIdFromSRMDB = async (
  industryPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Top Supplier Items for Industry ${industryPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // Get detail contracts for this industry
    const detailContracts = await DetailContract.findAll({
      include: [
        {
          model: MasterContract,
          as: 'masterContract',
          where: {
            industry_pkid: industryPkid,
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
          attributes: [],
        },
      ],
      where: {
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['supplier_item_pkid', 'target_grand_total'],
    });

    // Group by supplier item and sum grand totals
    const itemTotals = detailContracts.reduce((acc: any, detail: any) => {
      const itemId = detail.get('supplier_item_pkid');
      const total = parseFloat(detail.get('target_grand_total') || '0');
      acc[itemId] = (acc[itemId] || 0) + total;
      return acc;
    }, {});

    // Convert to array and sort by total
    const result = Object.entries(itemTotals)
      .map(([supplier_item_pkid, total_actual_grand_total]) => ({
        supplier_item_pkid: parseInt(supplier_item_pkid),
        total_actual_grand_total: (
          total_actual_grand_total as number
        ).toString(),
      }))
      .sort(
        (a: any, b: any) =>
          parseFloat(b.total_actual_grand_total) -
          parseFloat(a.total_actual_grand_total),
      )
      .slice(0, 10); // Top 10

    console.log(
      `✅ [Fallback SRM] Found top ${result.length} supplier items for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Top Supplier Items by Industry ID:`,
      error,
    );
    throw new Error(
      `Failed to get Top Supplier Items by Industry ID: ${error}`,
    );
  }
};

export const fallbackGetTopIndustryItemsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Top Industry Items for Supplier ${supplierPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // Get detail contracts for this supplier
    const detailContracts = await DetailContract.findAll({
      include: [
        {
          model: MasterContract,
          as: 'masterContract',
          where: {
            supplier_pkid: supplierPkid,
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
          attributes: [],
        },
      ],
      where: {
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['industry_item_pkid', 'target_grand_total'],
    });

    // Group by industry item and sum grand totals
    const itemTotals = detailContracts.reduce((acc: any, detail: any) => {
      const itemId = detail.get('industry_item_pkid');
      const total = parseFloat(detail.get('target_grand_total') || '0');
      acc[itemId] = (acc[itemId] || 0) + total;
      return acc;
    }, {});

    // Convert to array and sort by total
    const result = Object.entries(itemTotals)
      .map(([industry_item_pkid, total_actual_grand_total]) => ({
        industry_item_pkid: parseInt(industry_item_pkid),
        total_actual_grand_total: (
          total_actual_grand_total as number
        ).toString(),
      }))
      .sort(
        (a: any, b: any) =>
          parseFloat(b.total_actual_grand_total) -
          parseFloat(a.total_actual_grand_total),
      )
      .slice(0, 10); // Top 10

    console.log(
      `✅ [Fallback SRM] Found top ${result.length} industry items for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Top Industry Items by Supplier ID:`,
      error,
    );
    throw new Error(
      `Failed to get Top Industry Items by Supplier ID: ${error}`,
    );
  }
};

export const fallbackGetTopSupplierItemsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Top Supplier Items for Supplier ${supplierPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    // ✅ FIXED APPROACH: Get detail contracts for this supplier, then aggregate supplier items
    const detailContracts = await DetailContract.findAll({
      include: [
        {
          model: MasterContract,
          as: 'masterContract', // Use the correct association alias
          where: {
            supplier_pkid: supplierPkid,
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
          attributes: [], // We don't need master contract fields
        },
      ],
      where: {
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      attributes: ['supplier_item_pkid', 'target_grand_total'],
    });

    console.log(
      `📊 Found ${detailContracts.length} detail contracts for Supplier ${supplierPkid}`,
    );

    // Group by supplier item and sum grand totals
    const itemTotals = detailContracts.reduce((acc: any, detail: any) => {
      const itemId = detail.get('supplier_item_pkid');
      const total = parseFloat(detail.get('target_grand_total') || '0');

      console.log(
        `📊 Processing detail contract: supplier_item_pkid=${itemId}, target_grand_total=${total}`,
      );

      acc[itemId] = (acc[itemId] || 0) + total;
      return acc;
    }, {});

    console.log('📊 Aggregated supplier item totals:', itemTotals);

    // Convert to array and sort by total
    const result = Object.entries(itemTotals)
      .map(([supplier_item_pkid, total_actual_grand_total]) => ({
        supplier_item_pkid: parseInt(supplier_item_pkid),
        total_actual_grand_total: (
          total_actual_grand_total as number
        ).toString(),
        // ✅ ADD MOCK SUPPLIER ITEM DATA (since we don't have supplierItem relation)
        supplierItem: {
          pkid: parseInt(supplier_item_pkid),
          supplier_pkid: supplierPkid,
          name: `Supplier Item ${supplier_item_pkid}`, // Mock name for now
        },
      }))
      .sort(
        (a: any, b: any) =>
          parseFloat(b.total_actual_grand_total) -
          parseFloat(a.total_actual_grand_total),
      )
      .slice(0, 10); // Top 10

    console.log(
      `✅ [Fallback SRM] Found top ${result.length} supplier items for Supplier ${supplierPkid}:`,
      result,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Top Supplier Items by Supplier ID:`,
      error,
    );
    throw new Error(
      `Failed to get Top Supplier Items by Supplier ID: ${error}`,
    );
  }
};

export const fallbackGetTotalHistoryShipmentByIndustryAndYearFromSRMDB = async (
  industryPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total History Shipment for Industry ${industryPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    const historyShipments = await HistoryShipment.findAll({
      include: [
        {
          model: DetailContract,
          as: 'detailContract',
          include: [
            {
              model: MasterContract,
              as: 'masterContract',
              where: {
                industry_pkid: industryPkid,
                is_deleted: {
                  [Op.or]: [false, null],
                },
              },
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      where: {
        target_deadline_date: {
          [Op.between]: [startDate, endDate],
        },
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      order: [['target_deadline_date', 'DESC']],
    });

    // ✅ FIXED: Group by year and format like SRM API response
    const yearlyGrouped = historyShipments.reduce((acc: any, shipment: any) => {
      const year = new Date(shipment.target_deadline_date).getFullYear();

      if (!acc[year]) {
        acc[year] = {
          year,
          total: 0,
          historyShipments: [],
        };
      }

      acc[year].total++;
      acc[year].historyShipments.push(shipment.toJSON());
      return acc;
    }, {});

    // Convert to array format
    const result = Object.values(yearlyGrouped).sort(
      (a: any, b: any) => b.year - a.year,
    );

    console.log(
      `✅ [Fallback SRM] Found ${historyShipments.length} history shipments grouped into ${result.length} years for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total History Shipment by Industry:`,
      error,
    );
    throw new Error(
      `Failed to get Total History Shipment by Industry: ${error}`,
    );
  }
};

export const fallbackGetTotalHistoryShipmentBySupplierAndYearFromSRMDB = async (
  supplierPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting Total History Shipment for Supplier ${supplierPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    const historyShipments = await HistoryShipment.findAll({
      include: [
        {
          model: DetailContract,
          as: 'detailContract',
          include: [
            {
              model: MasterContract,
              as: 'masterContract',
              where: {
                supplier_pkid: supplierPkid,
                is_deleted: {
                  [Op.or]: [false, null],
                },
              },
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      where: {
        target_deadline_date: {
          [Op.between]: [startDate, endDate],
        },
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      order: [['target_deadline_date', 'DESC']],
    });

    // ✅ FIXED: Group by year and format like SRM API response
    const yearlyGrouped = historyShipments.reduce((acc: any, shipment: any) => {
      const year = new Date(shipment.target_deadline_date).getFullYear();

      if (!acc[year]) {
        acc[year] = {
          year,
          total: 0,
          historyShipments: [],
        };
      }

      acc[year].total++;
      acc[year].historyShipments.push(shipment.toJSON());
      return acc;
    }, {});

    // Convert to array format
    const result = Object.values(yearlyGrouped).sort(
      (a: any, b: any) => b.year - a.year,
    );

    console.log(
      `✅ [Fallback SRM] Found ${historyShipments.length} history shipments grouped into ${result.length} years for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting Total History Shipment by Supplier:`,
      error,
    );
    throw new Error(
      `Failed to get Total History Shipment by Supplier: ${error}`,
    );
  }
};

export const fallbackGetAllHistoryShipmentByIndustryForAllYearsFromSRMDB =
  async (industryPkid: number) => {
    try {
      console.log(
        `🔄 [Fallback SRM] Getting All History Shipment for Industry ${industryPkid} for All Years from SRM Contract DB`,
      );

      await srmContractDB.authenticate();

      const historyShipments = await HistoryShipment.findAll({
        include: [
          {
            model: DetailContract,
            as: 'detailContract',
            include: [
              {
                model: MasterContract,
                as: 'masterContract',
                where: {
                  industry_pkid: industryPkid,
                  is_deleted: {
                    [Op.or]: [false, null],
                  },
                },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        where: {
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
        order: [['target_deadline_date', 'DESC']],
      });

      // Group by year
      const yearlyData = historyShipments.reduce((acc: any, shipment: any) => {
        const year = new Date(shipment.target_deadline_date).getFullYear();
        if (!acc[year]) {
          acc[year] = {
            year,
            total: 0,
            historyShipments: [],
          };
        }
        acc[year].total++;
        acc[year].historyShipments.push(shipment.toJSON());
        return acc;
      }, {});

      const result = Object.values(yearlyData).sort(
        (a: any, b: any) => b.year - a.year,
      );

      console.log(
        `✅ [Fallback SRM] Found history shipments for ${result.length} years for Industry ${industryPkid}`,
      );

      return result;
    } catch (error) {
      console.error(
        `❌ [Fallback SRM] Error getting All History Shipment by Industry:`,
        error,
      );
      throw new Error(
        `Failed to get All History Shipment by Industry: ${error}`,
      );
    }
  };

export const fallbackGetAllHistoryShipmentBySupplierForAllYearsFromSRMDB =
  async (supplierPkid: number) => {
    try {
      console.log(
        `🔄 [Fallback SRM] Getting All History Shipment for Supplier ${supplierPkid} for All Years from SRM Contract DB`,
      );

      await srmContractDB.authenticate();

      const historyShipments = await HistoryShipment.findAll({
        include: [
          {
            model: DetailContract,
            as: 'detailContract',
            include: [
              {
                model: MasterContract,
                as: 'masterContract',
                where: {
                  supplier_pkid: supplierPkid,
                  is_deleted: {
                    [Op.or]: [false, null],
                  },
                },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        where: {
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
        order: [['target_deadline_date', 'DESC']],
      });

      // Group by year
      const yearlyData = historyShipments.reduce((acc: any, shipment: any) => {
        const year = new Date(shipment.target_deadline_date).getFullYear();
        if (!acc[year]) {
          acc[year] = {
            year,
            total: 0,
            historyShipments: [],
          };
        }
        acc[year].total++;
        acc[year].historyShipments.push(shipment.toJSON());
        return acc;
      }, {});

      const result = Object.values(yearlyData).sort(
        (a: any, b: any) => b.year - a.year,
      );

      console.log(
        `✅ [Fallback SRM] Found history shipments for ${result.length} years for Supplier ${supplierPkid}`,
      );

      return result;
    } catch (error) {
      console.error(
        `❌ [Fallback SRM] Error getting All History Shipment by Supplier:`,
        error,
      );
      throw new Error(
        `Failed to get All History Shipment by Supplier: ${error}`,
      );
    }
  };

export const fallbackGetHistoryShipmentsLastYearsByIndustryFromSRMDB = async (
  industryPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting History Shipments Last Years for Industry ${industryPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const historyShipments = await HistoryShipment.findAll({
        include: [
          {
            model: DetailContract,
            as: 'detailContract',
            include: [
              {
                model: MasterContract,
                as: 'masterContract',
                where: {
                  industry_pkid: industryPkid,
                  is_deleted: {
                    [Op.or]: [false, null],
                  },
                },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        where: {
          target_deadline_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: historyShipments.length,
        historyShipments: historyShipments.map((shipment) => shipment.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found history shipments for ${range} years for Industry ${industryPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting History Shipments Last Years by Industry:`,
      error,
    );
    throw new Error(
      `Failed to get History Shipments Last Years by Industry: ${error}`,
    );
  }
};

export const fallbackGetHistoryShipmentsLastYearsBySupplierFromSRMDB = async (
  supplierPkid: number,
  range: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting History Shipments Last Years for Supplier ${supplierPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < range; i++) {
      years.push(currentYear - i);
    }

    const result = [];
    for (const year of years) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const historyShipments = await HistoryShipment.findAll({
        include: [
          {
            model: DetailContract,
            as: 'detailContract',
            include: [
              {
                model: MasterContract,
                as: 'masterContract',
                where: {
                  supplier_pkid: supplierPkid,
                  is_deleted: {
                    [Op.or]: [false, null],
                  },
                },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        where: {
          target_deadline_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      result.push({
        year,
        total: historyShipments.length,
        historyShipments: historyShipments.map((shipment) => shipment.toJSON()),
      });
    }

    console.log(
      `✅ [Fallback SRM] Found history shipments for ${range} years for Supplier ${supplierPkid}`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting History Shipments Last Years by Supplier:`,
      error,
    );
    throw new Error(
      `Failed to get History Shipments Last Years by Supplier: ${error}`,
    );
  }
};

export const fallbackGetTotalTargetAndActualTotalPriceByIndustryAndYearFromSRMDB =
  async (industryPkid: number, startDate: Date, endDate: Date) => {
    try {
      console.log(
        `🔄 [Fallback SRM] Getting Total Target and Actual Price for Industry ${industryPkid} from SRM Contract DB`,
      );

      await srmContractDB.authenticate();

      const detailContracts = await DetailContract.findAll({
        include: [
          {
            model: MasterContract,
            as: 'masterContract',
            where: {
              industry_pkid: industryPkid,
              created_date: {
                [Op.between]: [startDate, endDate],
              },
              is_deleted: {
                [Op.or]: [false, null],
              },
            },
            attributes: [],
          },
          {
            model: HistoryShipment,
            as: 'historyShipments',
            required: false,
            where: {
              is_deleted: {
                [Op.or]: [false, null],
              },
            },
          },
        ],
        where: {
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      // Process each detail contract to calculate target vs actual
      const result = detailContracts.map((detail: any) => {
        const detailData = detail.toJSON();
        const historyShipments = detailData.historyShipments || [];

        const targetPrice = parseFloat(detailData.target_total_price || '0');
        const actualPrice = historyShipments.reduce(
          (sum: number, shipment: any) => {
            return sum + parseFloat(shipment.actual_item_total_price || '0');
          },
          0,
        );

        return {
          id: detailData.pkid,
          target_price: targetPrice,
          actual_price: actualPrice,
          target_quantity: parseFloat(detailData.target_quantity || '0'),
          actual_quantity: historyShipments.reduce(
            (sum: number, shipment: any) => {
              return sum + parseFloat(shipment.actual_quantity || '0');
            },
            0,
          ),
          year: new Date(detailData.created_date || new Date()).getFullYear(),
        };
      });

      console.log(
        `✅ [Fallback SRM] Found ${result.length} target vs actual records for Industry ${industryPkid}`,
      );

      return result;
    } catch (error) {
      console.error(
        `❌ [Fallback SRM] Error getting Total Target and Actual Price by Industry:`,
        error,
      );
      throw new Error(
        `Failed to get Total Target and Actual Price by Industry: ${error}`,
      );
    }
  };

export const fallbackGetTotalTargetAndActualTotalPriceBySupplierAndYearFromSRMDB =
  async (supplierPkid: number, startDate: Date, endDate: Date) => {
    try {
      console.log(
        `🔄 [Fallback SRM] Getting Total Target and Actual Price for Supplier ${supplierPkid} from SRM Contract DB`,
      );

      await srmContractDB.authenticate();

      const detailContracts = await DetailContract.findAll({
        include: [
          {
            model: MasterContract,
            as: 'masterContract',
            where: {
              supplier_pkid: supplierPkid,
              created_date: {
                [Op.between]: [startDate, endDate],
              },
              is_deleted: {
                [Op.or]: [false, null],
              },
            },
            attributes: [],
          },
          {
            model: HistoryShipment,
            as: 'historyShipments',
            required: false,
            where: {
              is_deleted: {
                [Op.or]: [false, null],
              },
            },
          },
        ],
        where: {
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
      });

      // Process each detail contract to calculate target vs actual
      const result = detailContracts.map((detail: any) => {
        const detailData = detail.toJSON();
        const historyShipments = detailData.historyShipments || [];

        const targetPrice = parseFloat(detailData.target_total_price || '0');
        const actualPrice = historyShipments.reduce(
          (sum: number, shipment: any) => {
            return sum + parseFloat(shipment.actual_item_total_price || '0');
          },
          0,
        );

        return {
          id: detailData.pkid,
          target_price: targetPrice,
          actual_price: actualPrice,
          target_quantity: parseFloat(detailData.target_quantity || '0'),
          actual_quantity: historyShipments.reduce(
            (sum: number, shipment: any) => {
              return sum + parseFloat(shipment.actual_quantity || '0');
            },
            0,
          ),
          year: new Date(detailData.created_date || new Date()).getFullYear(),
        };
      });

      console.log(
        `✅ [Fallback SRM] Found ${result.length} target vs actual records for Supplier ${supplierPkid}`,
      );

      return result;
    } catch (error) {
      console.error(
        `❌ [Fallback SRM] Error getting Total Target and Actual Price by Supplier:`,
        error,
      );
      throw new Error(
        `Failed to get Total Target and Actual Price by Supplier: ${error}`,
      );
    }
  };

export const fallbackGetAllMasterContractMetricsByIndustryIdFromSRMDB = async (
  industryPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting All Master Contract Metrics for Industry ${industryPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    const totalContracts = await MasterContract.count({
      where: {
        industry_pkid: industryPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const activeContracts = await MasterContract.count({
      where: {
        industry_pkid: industryPkid,
        status: 'Active',
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const result = {
      total: totalContracts,
      active: activeContracts,
    };

    console.log(
      `✅ [Fallback SRM] Found contract metrics for Industry ${industryPkid}: ${totalContracts} total, ${activeContracts} active`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting All Master Contract Metrics by Industry:`,
      error,
    );
    throw new Error(
      `Failed to get All Master Contract Metrics by Industry: ${error}`,
    );
  }
};

export const fallbackGetAllMasterContractMetricsBySupplierIdFromSRMDB = async (
  supplierPkid: number,
) => {
  try {
    console.log(
      `🔄 [Fallback SRM] Getting All Master Contract Metrics for Supplier ${supplierPkid} from SRM Contract DB`,
    );

    await srmContractDB.authenticate();

    const totalContracts = await MasterContract.count({
      where: {
        supplier_pkid: supplierPkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const activeContracts = await MasterContract.count({
      where: {
        supplier_pkid: supplierPkid,
        status: 'Active',
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
    });

    const result = {
      total: totalContracts,
      active: activeContracts,
    };

    console.log(
      `✅ [Fallback SRM] Found contract metrics for Supplier ${supplierPkid}: ${totalContracts} total, ${activeContracts} active`,
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [Fallback SRM] Error getting All Master Contract Metrics by Supplier:`,
      error,
    );
    throw new Error(
      `Failed to get All Master Contract Metrics by Supplier: ${error}`,
    );
  }
};

export const fallbackGetAllMasterContractMetricsInYearByIndustryIdFromSRMDB =
  async (industryPkid: number, startDate: Date, endDate: Date) => {
    try {
      console.log(
        `🔄 [Fallback SRM] Getting All Master Contract Metrics in Year for Industry ${industryPkid} from SRM Contract DB`,
      );

      await srmContractDB.authenticate();

      const contracts = await MasterContract.findAll({
        where: {
          industry_pkid: industryPkid,
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
        order: [['created_date', 'DESC']],
      });

      const contractsData = contracts.map((contract) => contract.toJSON());

      console.log(
        `✅ [Fallback SRM] Found ${contractsData.length} contracts in year for Industry ${industryPkid}`,
      );

      return contractsData;
    } catch (error) {
      console.error(
        `❌ [Fallback SRM] Error getting All Master Contract Metrics in Year by Industry:`,
        error,
      );
      throw new Error(
        `Failed to get All Master Contract Metrics in Year by Industry: ${error}`,
      );
    }
  };

export const fallbackGetAllMasterContractMetricsInYearBySupplierIdFromSRMDB =
  async (supplierPkid: number, startDate: Date, endDate: Date) => {
    try {
      console.log(
        `🔄 [Fallback SRM] Getting All Master Contract Metrics in Year for Supplier ${supplierPkid} from SRM Contract DB`,
      );

      await srmContractDB.authenticate();

      const contracts = await MasterContract.findAll({
        where: {
          supplier_pkid: supplierPkid,
          created_date: {
            [Op.between]: [startDate, endDate],
          },
          is_deleted: {
            [Op.or]: [false, null],
          },
        },
        order: [['created_date', 'DESC']],
      });

      // ✅ FIXED: Group by year and format like SRM API response
      const yearlyGrouped = contracts.reduce((acc: any, contract: any) => {
        const year = new Date(contract.created_date).getFullYear();

        if (!acc[year]) {
          acc[year] = {
            year,
            total: 0,
            active: 0,
            masterContracts: [],
          };
        }

        acc[year].total++;
        if (contract.status === 'Active') {
          acc[year].active++;
        }
        acc[year].masterContracts.push(contract.toJSON());
        return acc;
      }, {});

      // Convert to array format
      const result = Object.values(yearlyGrouped).sort(
        (a: any, b: any) => a.year - b.year,
      );

      console.log(
        `✅ [Fallback SRM] Found ${contracts.length} contracts grouped into ${result.length} years for Supplier ${supplierPkid}`,
      );

      return result;
    } catch (error) {
      console.error(
        `❌ [Fallback SRM] Error getting All Master Contract Metrics in Year by Supplier:`,
        error,
      );
      throw new Error(
        `Failed to get All Master Contract Metrics in Year by Supplier: ${error}`,
      );
    }
  };
