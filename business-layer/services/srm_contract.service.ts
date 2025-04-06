import * as srmContractIntegration from '../../data-access/integrations/srm_contract.integration';

export class SRMContractService {
  async fetchAllSRMContract() {
    const response = await srmContractIntegration.getAllSRMContract();
    return response.data.data;
  }

  //INDUSTRY
  // 1. Penerimaan terlambat
  // 2. Jumlah tidak sesuai
  // 3. Bahan baku kotor
  // 4. Cek brix 1 tidak lolos
  // 5. Cek brix 2 tidak lolos

  //SUPPLIER
  // 1. Penurunan jumlah contract
  // 2. Pengiriman terlambat
  // 3. Jumlah tidak sesuai
  // 4. Bahan baku kotor
  // 5. Cek brix 1 tidak lolos
  // 6. Cek brix 2 tidak lolos
}
