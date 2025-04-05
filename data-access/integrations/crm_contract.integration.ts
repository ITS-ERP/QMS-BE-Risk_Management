import { contractCRMApi } from '.';

// Penurunan jumlah kontrak

// Pengiriman terlambat
export const getOnTimeVsLateTrend = () =>
  contractCRMApi.get(`/contract_crm/trend/on-time-late`);

// Jumlah tidak sesuai
export const getCompliantVsNonCompliantTrend = () =>
  contractCRMApi.get(`/contract_crm/trend/compliant-noncompliant`);
