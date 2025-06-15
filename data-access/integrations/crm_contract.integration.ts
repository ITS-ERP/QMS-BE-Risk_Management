import { crmContractApi } from '.';

export const getAllContracts = () => crmContractApi.get(`/contract/`);

export const getContractByID = (pkid: number) =>
  crmContractApi.get(`/contract/${pkid}`);

export const getAllContractDetail = () =>
  crmContractApi.get(`/contractDetail/`);

export const getAllContractDetailsByID = (pkid: number) =>
  crmContractApi.get(`/contractDetail/${pkid}`);

export const getContractDetailsByContractID = (pkid: number) =>
  crmContractApi.get(`/contractDetail/contract/${pkid}`);
