import * as crmRequisitionIntegration from '../../data-access/integrations/crm_requisition.integration';

export class CRMRequisitionService {
  async fetchAllCRMLoR() {
    const response = await crmRequisitionIntegration.getAllCRMLoR();
    return response.data.data;
  }

  async fetchAllCRMLoA() {
    const response = await crmRequisitionIntegration.getAllCRMLoA();
    return response.data.data;
  }

  //INDUSTRY
  // 1. Penolakan LoR
  // 2. Penolakan LoA

  //RETAIL
  // 1. Penolakan LoR
  // 2. Penolakan LoA
}
