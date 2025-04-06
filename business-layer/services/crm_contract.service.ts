import * as crmContractIntegration from '../../data-access/integrations/crm_contract.integration';

export class CRMContractService {
  async fetchAllCRMContract() {
    const response = await crmContractIntegration.getAllCRMContract();
    return response.data.data;
  }

  //INDUSTRY
  // 1. Penurunan jumlah kontrak
  // 2. Pengiriman terlambat
  // 3. Jumlah tidak sesuai

  //RETAIL
  // 1. Penerimaan terlambat
  // 2. Jumlah tidak sesuai
}
