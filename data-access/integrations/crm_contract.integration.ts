import { crmContractApi } from '.';

export const getAllCRMContract = () => crmContractApi.get(`/contract_crm/`);

// 1. Penurunan jumlah kontrak

// 2. Pengiriman terlambat
// export const getOnTimeVsLateTrend = () =>
//   crmContractApi.get(`/contract_crm/trend/on-time-late`);

// 3. Jumlah tidak sesuai
// export const getCompliantVsNonCompliantTrend = () =>
//   crmContractApi.get(`/contract_crm/trend/compliant-noncompliant`);
