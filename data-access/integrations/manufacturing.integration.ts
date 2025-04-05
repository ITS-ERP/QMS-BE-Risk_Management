import { manufacturingApi } from '.';

export const getAllInspectionProduct = () =>
  manufacturingApi.get(`/inspection_product`);

export const getInspectionProductByPkid = (pkid: number) =>
  manufacturingApi.get(`/inspection_product/${pkid}`);

export const getProductionRequestHeader = () =>
  manufacturingApi.get(`/productionRequest/headers`);

export const getInspectionProduct = () =>
  manufacturingApi.get(`/inspectionproduct/`);
