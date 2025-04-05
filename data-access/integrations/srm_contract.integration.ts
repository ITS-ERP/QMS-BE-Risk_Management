import { contractSRMApi } from '.';

export const getOnTimeVsLateTrend = () =>
  contractSRMApi.get(`/contract_srm/trend/on-time-late`);

export const getCompliantVsNonCompliantTrend = () =>
  contractSRMApi.get(`/contract_srm/trend/compliant-noncompliant`);

//Bahan baku kotor
//Cek brix 1 tidak lolos
//Cek brix 2 tidak lolos
