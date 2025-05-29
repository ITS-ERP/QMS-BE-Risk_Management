import { srmSupplierPortalApi } from '.';

export const findSupplierByParamTenantID = (tenant_id: number) =>
  srmSupplierPortalApi.get(`/qms/supplier/tenant/${tenant_id}`);
