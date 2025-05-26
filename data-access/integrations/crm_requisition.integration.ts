import { crmRequisitionApi } from '.';

export const getAllLetterOfRequest = () =>
  crmRequisitionApi.get(`/letterOfRequest/`);

export const getLetterOfRequestByID = (pkid: number) =>
  crmRequisitionApi.get(`/letterOfRequest/${pkid}`);

export const getLetterOfRequestDetailsByLORID = (pkid: number) =>
  crmRequisitionApi.get(`/letterOfRequestProducts/${pkid}`);

export const getAllLetterOfAgreements = () =>
  crmRequisitionApi.get(`/letterOfAgreement/`);

export const getLetterOfAgreementByID = (pkid: number) =>
  crmRequisitionApi.get(`/letterOfAgreement/${pkid}`);
