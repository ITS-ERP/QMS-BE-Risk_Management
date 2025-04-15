import { forecastApi } from '.';

// INDUSTRY
export const getRejectReceiveByYearIndustry = () =>
  forecastApi.get('/general_forecast?endpoint=reject_receive_by_year');
export const getRejectTransferByYearIndustry = () =>
  forecastApi.get('/general_forecast?endpoint=reject_transfer_by_year');
export const getDefectInspectionProductByYearIndustry = () =>
  forecastApi.get(
    '/general_forecast?endpoint=defect_inspection_product_by_year',
  );
export const getDelayedSRMIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=delayed_count&industry_code=${industry_code}`,
  );
export const getLateSRMIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=late&industry_code=${industry_code}`,
  );
export const getNoncompliantQuantitySRMIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=noncompliant_quantity&industry_code=${industry_code}`,
  );
export const getUncleanCheckIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=unclean_check&industry_code=${industry_code}`,
  );
export const getUnderBrixCheckIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=under_brix_check&industry_code=${industry_code}`,
  );
export const getLORRejectIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=lor_reject&industry_code=${industry_code}`,
  );
export const getLOARejectIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=loa_reject&industry_code=${industry_code}`,
  );
export const getTotalContractCRMIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=crm_total_contract&industry_code=${industry_code}`,
  );

export const getLateCRMIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=crm_late&industry_code=${industry_code}`,
  );
export const getNoncompliantQuantityCRMIndustry = (industry_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=crm_noncompliant_quantity&industry_code=${industry_code}`,
  );

// SUPPLIER
export const getLoseCountSupplier = (supplier_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=lose_count&supplier_code=${supplier_code}`,
  );
export const getLateSRMSupplier = (supplier_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=late&supplier_code=${supplier_code}`,
  );
export const getNoncompliantQuantitySRMSupplier = (supplier_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=noncompliant_quantity&supplier_code=${supplier_code}`,
  );
export const getUncleanCheckSupplier = (supplier_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=unclean_check&supplier_code=${supplier_code}`,
  );
export const getUnderBrixCheckSupplier = (supplier_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=under_brix_check&supplier_code=${supplier_code}`,
  );
export const getTotalContractSRMSupplier = (supplier_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=total_contract&supplier_code=${supplier_code}`,
  );

// RETAIL
export const getLORRejectRetail = (retail_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=lor_reject&retail_code=${retail_code}`,
  );
export const getLOARejectRetail = (retail_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=loa_reject&retail_code=${retail_code}`,
  );
export const getLateCRMRetail = (retail_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=crm_late&retail_code=${retail_code}`,
  );
export const getNoncompliantQuantityCRMRetail = (retail_code: string) =>
  forecastApi.get(
    `/general_forecast?endpoint=crm_noncompliant_quantity&retail_code=${retail_code}`,
  );
