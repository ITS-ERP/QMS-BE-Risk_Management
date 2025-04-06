import { erpManufacturingApi } from '.';

export const getAllInspectionProduct = () =>
  erpManufacturingApi.get(`/inspection_product`);

export const getInspectionProductByPkid = (pkid: number) =>
  erpManufacturingApi.get(`/inspection_product/${pkid}`);

export const getProductionRequestHeader = () =>
  erpManufacturingApi.get(`/productionRequest/headers`);

export const getInspectionProduct = () =>
  erpManufacturingApi.get(`/inspectionproduct/`);
