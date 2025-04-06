import { crmRequisitionApi } from '.';

export const getAllCRMLoR = () => crmRequisitionApi.get(`/lor_crm/`);

export const getAllCRMLoA = () => crmRequisitionApi.get(`/loa_crm/`);

// 1. Penolakan LoR
// export const getLoRApprovedRejectedTrend = () =>
//   requisitionCRMApi.get(`/lor_crm/trend/approved-rejected`);

// 2. Penolakan LoA
// export const getLoAApprovedRejectedTrend = () =>
//   requisitionCRMApi.get(`/loa_crm/trend/approved-rejected`);
