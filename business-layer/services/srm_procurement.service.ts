import * as srmProcurementIntegration from '../../data-access/integrations/srm_procurement.integration';

export class SRMProcurementService {
  async fetchAllSRMProcurement() {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    return response.data.data;
  }

  //INDUSTRY
  //1. Keterlambatan RFQ dari purchase request

  //SUPPLIER
  //1. Kekalahan pada proses RFQ
}
