import { contractCRMApi } from '.';

// Penolakan LoR
export const getLoRApprovedRejectedTrend = () =>
  contractCRMApi.get(`/lor_crm/trend/approved-rejected`);

// Penolakan LoA
export const getLoAApprovedRejectedTrend = () =>
  contractCRMApi.get(`/loa_crm/trend/approved-rejected`);
