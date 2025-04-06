import { srmContractApi } from '.';

export const getAllSRMContract = () => srmContractApi.get(`/contract_srm/`);

//1. Penerimaan terlambat
// export const getOnTimeVsLateTrend = () =>
//   srmContractApi.get(`/contract_srm/trend/on-time-late`);

// 2. Jumlah tidak sesuai
// export const getCompliantVsNonCompliantTrend = () =>
//   srmContractApi.get(`/contract_srm/trend/compliant-noncompliant`);

// 3. Bahan baku kotor
// 4. Cek brix 1 tidak lolos
// 5. Cek brix 2 tidak lolos
