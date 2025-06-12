import { Request } from 'express';
import { forecastAPI } from '.';

// INDUSTRY - Updated to use tenant_id with authentication
export const getRejectReceiveByYearIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=reject_receive_by_year&industry_tenant_id=${industry_tenant_id}`,
  );

export const getRejectTransferByYearIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=reject_transfer_by_year&industry_tenant_id=${industry_tenant_id}`,
  );

export const getDefectInspectionProductByYearIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=defect_inspection_product_by_year&industry_tenant_id=${industry_tenant_id}`,
  );

// export const getDelayedSRMIndustry = (
//   req: Request,
//   industry_tenant_id: number,
// ) =>
//   forecastAPI(req).get(
//     `/general_forecast?endpoint=delayed_count&industry_tenant_id=${industry_tenant_id}`,
//   );

export const getDirectRFQRejectIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=direct_rfq_reject&industry_tenant_id=${industry_tenant_id}`,
  );

export const getLateSRMIndustry = (req: Request, industry_tenant_id: number) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=late&industry_tenant_id=${industry_tenant_id}`,
  );

export const getNoncompliantQuantitySRMIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=noncompliant_quantity&industry_tenant_id=${industry_tenant_id}`,
  );

export const getLORRejectIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=lor_reject&industry_tenant_id=${industry_tenant_id}`,
  );

export const getLOARejectIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=loa_reject&industry_tenant_id=${industry_tenant_id}`,
  );

export const getTotalContractCRMIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=crm_total_contract&industry_tenant_id=${industry_tenant_id}`,
  );

export const getLateCRMIndustry = (req: Request, industry_tenant_id: number) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=crm_late&industry_tenant_id=${industry_tenant_id}`,
  );

export const getNoncompliantQuantityCRMIndustry = (
  req: Request,
  industry_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=crm_noncompliant_quantity&industry_tenant_id=${industry_tenant_id}`,
  );

// SUPPLIER - Updated to use tenant_id with authentication
export const getLoseCountSupplier = (
  req: Request,
  supplier_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=lose_count&supplier_tenant_id=${supplier_tenant_id}`,
  );

export const getLateSRMSupplier = (req: Request, supplier_tenant_id: number) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=late&supplier_tenant_id=${supplier_tenant_id}`,
  );

export const getNoncompliantQuantitySRMSupplier = (
  req: Request,
  supplier_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=noncompliant_quantity&supplier_tenant_id=${supplier_tenant_id}`,
  );

export const getTotalContractSRMSupplier = (
  req: Request,
  supplier_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=total_contract&supplier_tenant_id=${supplier_tenant_id}`,
  );

// RETAIL - Updated to use tenant_id with authentication
export const getLORRejectRetail = (req: Request, retail_tenant_id: number) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=lor_reject&retail_tenant_id=${retail_tenant_id}`,
  );

export const getLOARejectRetail = (req: Request, retail_tenant_id: number) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=loa_reject&retail_tenant_id=${retail_tenant_id}`,
  );

export const getLateCRMRetail = (req: Request, retail_tenant_id: number) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=crm_late&retail_tenant_id=${retail_tenant_id}`,
  );

export const getNoncompliantQuantityCRMRetail = (
  req: Request,
  retail_tenant_id: number,
) =>
  forecastAPI(req).get(
    `/general_forecast?endpoint=crm_noncompliant_quantity&retail_tenant_id=${retail_tenant_id}`,
  );
