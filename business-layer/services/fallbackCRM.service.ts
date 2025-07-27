import { Op } from 'sequelize';
import {
  LetterOfRequest,
  LetterOfAgreement,
} from '../../rabbit/external/crmRequisitionDB';
import {
  Contract,
  ContractDetail,
  HistoryShipment,
} from '../../rabbit/external/crmContractDB';

export interface CRMContractData {
  pkid: number;
  code: string;
  industry_pkid: number;
  retail_pkid: number;
  start_date: Date;
  end_date: Date;
  amount_of_item: number;
  contract_type: string;
  payment_method: string;
  status: string;
  letter_of_agreement_pkid: number;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export interface CRMContractDetailData {
  pkid: number;
  code: string;
  currency_code: string;
  target_total_price: number;
  description?: string;
  tax_id: number;
  item_pkid: number;
  contract_pkid: number;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
  history_shipments?: CRMHistoryShipmentData[];
}

export interface CRMHistoryShipmentData {
  pkid: number;
  code: string;
  target_date: Date;
  delivered_date?: Date;
  target_quantity: number;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  is_rejected: boolean;
  price_per_item: number;
  total_price: number;
  description: string;
  status: string;
  contract_detail_pkid: number;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export const fallbackGetLoRFromCRMDB = async (
  tenant_id: number,
  startDate: Date,
  endDate: Date,
) => {
  try {
    console.log(
      `🔄 [Fallback LoR] Querying CRM DB for tenant ${tenant_id}, dates: ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    const lors = await LetterOfRequest.findAll({
      where: {
        [Op.or]: [
          {
            created_date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
          {
            confirmation_due_date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        ],
      },
      raw: false,
    });

    const lorData = lors.map((lor) => lor.toJSON());
    console.log(
      `✅ [Fallback LoR] Found ${lorData.length} Letter of Requests from CRM DB`,
    );

    return lorData;
  } catch (error) {
    console.error('❌ [Fallback LoR] Error fetching LoR from CRM DB:', error);
    throw error;
  }
};

export const fallbackGetLoAFromCRMDB = async (
  tenant_id: number,
  startDate: Date,
  endDate: Date,
) => {
  try {
    console.log(
      `🔄 [Fallback LoA] Querying CRM DB for tenant ${tenant_id}, dates: ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    const loas = await LetterOfAgreement.findAll({
      where: {
        [Op.or]: [
          {
            created_date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
          {
            confirmation_due_date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        ],
      },
      raw: false,
    });

    const loaData = loas.map((loa) => loa.toJSON());
    console.log(
      `✅ [Fallback LoA] Found ${loaData.length} Letter of Agreements from CRM DB`,
    );

    return loaData;
  } catch (error) {
    console.error('❌ [Fallback LoA] Error fetching LoA from CRM DB:', error);
    throw error;
  }
};

export const fallbackGetContractsFromCRMDB = async (
  tenant_id: number,
  startDate: Date,
  endDate: Date,
) => {
  try {
    console.log(
      `🔄 [Fallback Contract] Querying CRM DB for tenant ${tenant_id}, dates: ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [
          {
            created_date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
          {
            start_date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        ],
      },
      raw: false,
    });

    const contractData = contracts.map((contract) => contract.toJSON());
    console.log(
      `✅ [Fallback Contract] Found ${contractData.length} Contracts from CRM DB`,
    );

    return contractData;
  } catch (error) {
    console.error(
      '❌ [Fallback Contract] Error fetching Contracts from CRM DB:',
      error,
    );
    throw error;
  }
};

export const fallbackGetContractDetailsWithShipmentsFromCRMDB = async (
  tenant_id: number,
) => {
  try {
    console.log(
      `🔄 [Fallback Contract Details] Querying CRM DB for tenant ${tenant_id}`,
    );

    const contractDetails = await ContractDetail.findAll({
      include: [
        {
          model: HistoryShipment,
          as: 'history_shipments',
          required: false,
        },
      ],
      raw: false,
    });

    const contractDetailData = contractDetails.map((detail) => {
      const detailJson = detail.toJSON();
      return detailJson;
    });

    console.log(
      `✅ [Fallback Contract Details] Found ${contractDetailData.length} Contract Details with shipments from CRM DB`,
    );

    return contractDetailData;
  } catch (error) {
    console.error(
      '❌ [Fallback Contract Details] Error fetching Contract Details with Shipments from CRM DB:',
      error,
    );
    throw error;
  }
};

export const fallbackGetContractByPkidFromCRMDB = async (
  contract_pkid: number,
): Promise<CRMContractData | null> => {
  try {
    console.log(
      `🔄 [Fallback CRM Contract] Querying CRM Contract DB for contract pkid ${contract_pkid}`,
    );

    const contract = (await Contract.findOne({
      where: {
        pkid: contract_pkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      raw: true,
    })) as unknown as CRMContractData | null;

    if (contract) {
      console.log(
        `✅ [Fallback CRM Contract] Found contract: ${contract.code} (status: ${contract.status})`,
      );
    } else {
      console.log(
        `⚠️ [Fallback CRM Contract] No contract found for pkid: ${contract_pkid}`,
      );
    }

    return contract;
  } catch (error) {
    console.error(
      `❌ [Fallback CRM Contract] Error fetching contract for pkid ${contract_pkid}:`,
      error,
    );
    throw error;
  }
};

export const fallbackGetAllContractsFromCRMDB = async (): Promise<
  CRMContractData[]
> => {
  try {
    console.log(
      `🔄 [Fallback CRM Contract] Querying CRM Contract DB for all contracts`,
    );

    const contracts = (await Contract.findAll({
      where: {
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      raw: true,
      order: [['created_date', 'DESC']],
    })) as unknown as CRMContractData[];

    console.log(
      `✅ [Fallback CRM Contract] Found ${contracts.length} total CRM contracts`,
    );

    return contracts;
  } catch (error) {
    console.error(
      `❌ [Fallback CRM Contract] Error fetching all CRM contracts:`,
      error,
    );
    throw error;
  }
};

export const fallbackGetContractsByIndustryFromCRMDB = async (
  industry_id: number,
): Promise<CRMContractData[]> => {
  try {
    console.log(
      `🔄 [Fallback CRM Contract] Querying CRM Contract DB for industry ${industry_id}`,
    );

    const contracts = (await Contract.findAll({
      where: {
        industry_pkid: industry_id,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      raw: true,
    })) as unknown as CRMContractData[];

    console.log(
      `✅ [Fallback CRM Contract] Found ${contracts.length} contracts for industry ${industry_id}`,
    );

    return contracts;
  } catch (error) {
    console.error(
      `❌ [Fallback CRM Contract] Error fetching contracts for industry ${industry_id}:`,
      error,
    );
    throw error;
  }
};

export const fallbackGetContractsByRetailFromCRMDB = async (
  retail_id: number,
): Promise<CRMContractData[]> => {
  try {
    console.log(
      `🔄 [Fallback CRM Contract] Querying CRM Contract DB for retail ${retail_id}`,
    );

    const contracts = (await Contract.findAll({
      where: {
        retail_pkid: retail_id,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      raw: true,
    })) as unknown as CRMContractData[];

    console.log(
      `✅ [Fallback CRM Contract] Found ${contracts.length} contracts for retail ${retail_id}`,
    );

    return contracts;
  } catch (error) {
    console.error(
      `❌ [Fallback CRM Contract] Error fetching contracts for retail ${retail_id}:`,
      error,
    );
    throw error;
  }
};

export const fallbackGetCRMContractsWithUserResolution = async (
  tenant_id: number,
  user_type: 'industry' | 'retail',
): Promise<CRMContractData[]> => {
  try {
    console.log(
      `🔄 [Fallback CRM Combined] Getting contracts with user resolution for tenant ${tenant_id} (${user_type})`,
    );

    let contracts: CRMContractData[] = [];

    if (user_type === 'industry') {
      contracts = await fallbackGetContractsByIndustryFromCRMDB(tenant_id);
    } else if (user_type === 'retail') {
      contracts = await fallbackGetContractsByRetailFromCRMDB(tenant_id);
    }

    console.log(
      `✅ [Fallback CRM Combined] Retrieved ${contracts.length} contracts for ${user_type} tenant ${tenant_id}`,
    );

    return contracts;
  } catch (error) {
    console.error(
      `❌ [Fallback CRM Combined] Error getting contracts with user resolution:`,
      error,
    );
    throw error;
  }
};

export const fallbackGetContractDetailsByContractPkidFromCRMDB = async (
  contract_pkid: number,
): Promise<CRMContractDetailData[]> => {
  try {
    console.log(
      `🔄 [Fallback CRM Contract Details] Querying CRM DB for contract details of contract ${contract_pkid}`,
    );

    const contractDetails = (await ContractDetail.findAll({
      where: {
        contract_pkid: contract_pkid,
        is_deleted: {
          [Op.or]: [false, null],
        },
      },
      include: [
        {
          model: HistoryShipment,
          as: 'history_shipments',
          required: false,
          where: {
            is_deleted: {
              [Op.or]: [false, null],
            },
          },
        },
      ],
      raw: false,
    })) as unknown as any[];

    const contractDetailData = contractDetails.map((detail) => {
      return detail.toJSON() as CRMContractDetailData;
    });

    console.log(
      `✅ [Fallback CRM Contract Details] Found ${contractDetailData.length} contract details for contract ${contract_pkid}`,
    );

    return contractDetailData;
  } catch (error) {
    console.error(
      `❌ [Fallback CRM Contract Details] Error fetching contract details for contract ${contract_pkid}:`,
      error,
    );
    throw error;
  }
};

export const fallbackTestCRMConnections = async () => {
  try {
    console.log(`🔍 [Fallback Test] Testing CRM database connections...`);
    const contractTest = (await Contract.findOne({
      limit: 1,
      raw: true,
    })) as unknown as CRMContractData | null;
    console.log(
      `✅ [Fallback Test] CRM Contract Management DB connection: ${contractTest ? 'SUCCESS' : 'EMPTY TABLE'}`,
    );
    const lorTest = await LetterOfRequest.findOne({
      limit: 1,
      raw: true,
    });
    console.log(
      `✅ [Fallback Test] CRM Requisition DB connection: ${lorTest ? 'SUCCESS' : 'EMPTY TABLE'}`,
    );
    const contractDetailTest = (await ContractDetail.findOne({
      limit: 1,
      raw: true,
    })) as unknown as CRMContractDetailData | null;
    console.log(
      `✅ [Fallback Test] CRM Contract Details connection: ${contractDetailTest ? 'SUCCESS' : 'EMPTY TABLE'}`,
    );

    return {
      contractManagementDB: contractTest !== null,
      requisitionDB: lorTest !== null,
      contractDetailsDB: contractDetailTest !== null,
      status: 'connections_verified',
    };
  } catch (error) {
    console.error(
      `❌ [Fallback Test] CRM Database connection test failed:`,
      error,
    );
    throw error;
  }
};
