import { crmContractApi } from '.';

export const getAllContracts = () => crmContractApi.get(`/contract/`);

export const getContractByID = (pkid: number) =>
  crmContractApi.get(`/contract/${pkid}`);

export const getAllContractDetails = () =>
  crmContractApi.get(`/contractDetails/`);

export const getAllContractDetailsByID = (pkid: number) =>
  crmContractApi.get(`/contractDetails/${pkid}`);

export const getContractDetailsByContractID = (pkid: number) =>
  crmContractApi.get(`/contractDetails/contract/${pkid}`);
