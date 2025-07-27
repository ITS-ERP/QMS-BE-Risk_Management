import { srmProcurementApi } from '.';

export const getAllSRMProcurement = () =>
  srmProcurementApi.get(`/procurement_srm`);
export const findTotalRFQByStatusByIndustryID = (pkid: number) =>
  srmProcurementApi.get(`/qms/rfq/status/industry/${pkid}`);

export const findTotalRFQByStatusBySupplierID = (pkid: number) =>
  srmProcurementApi.get(`/qms/rfq/status/supplier/${pkid}`);
export const findTotalDirectRFQByStatusAndIndustryID = (pkid: number) =>
  srmProcurementApi.get(`/qms/directRFQ/status/industry/${pkid}`);

export const findTotalDirectRFQByStatusAndSupplierID = (pkid: number) =>
  srmProcurementApi.get(`/qms/directRFQ/status/supplier/${pkid}`);
export const findTotalRFQForLastYearsByIndustryID = (
  pkid: number,
  range: number,
) =>
  srmProcurementApi.get(`/qms/rfq/lastYears/industry/${pkid}/range/${range}`);

export const findTotalRFQForLastYearsBySupplierID = (
  pkid: number,
  range: number,
) =>
  srmProcurementApi.get(`/qms/rfq/lastYears/supplier/${pkid}/range/${range}`);
export const findTotalDirectRFQForLastYearsByIndustryID = (
  pkid: number,
  range: number,
) =>
  srmProcurementApi.get(
    `/qms/directRFQ/lastYears/industry/${pkid}/range/${range}`,
  );

export const findTotalDirectRFQForLastYearsBySupplierID = (
  pkid: number,
  range: number,
) =>
  srmProcurementApi.get(
    `/qms/directRFQ/lastYears/supplier/${pkid}/range/${range}`,
  );
export const findWinningRFQsBySupplierInDateRange = (
  pkid: number,
  start_date: string,
  end_date: string,
) =>
  srmProcurementApi.get(
    `/qms/rfq/winning/supplier/${pkid}?start_date=${start_date}&end_date=${end_date}`,
  );

export const findLostRFQsBySupplierInDateRange = (
  pkid: number,
  start_date: string,
  end_date: string,
) =>
  srmProcurementApi.get(
    `/qms/rfq/lost/supplier/${pkid}?start_date=${start_date}&end_date=${end_date}`,
  );
export const findAcceptedDirectRFQsByIndustryIDinRange = (
  pkid: number,
  range: number,
) =>
  srmProcurementApi.get(
    `/qms/directRFQ/accepted/industry/${pkid}/range/${range}`,
  );

export const findRejectedDirectRFQsByIndustryIDinRange = (
  pkid: number,
  range: number,
) =>
  srmProcurementApi.get(
    `/qms/directRFQ/rejected/industry/${pkid}/range/${range}`,
  );
