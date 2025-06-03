import { Request } from 'express';
import { erpManufacturingApi, erpManufacturingAPI } from '.';
import { ERPApiResponse, InspectionProductItem } from '../utility/interfaces';

// EXISTING
export const getAllInspectionProduct = () =>
  erpManufacturingApi.get(`/inspection_product`);

export const getInspectionProductByPkid = (pkid: number) =>
  erpManufacturingApi.get(`/inspection_product/${pkid}`);

export const getProductionRequestHeader = () =>
  erpManufacturingApi.get(`/productionRequest/headers`);

export const getInspectionProduct = () =>
  erpManufacturingApi.get(`/inspectionproduct/`);

// NEW functions with auth support
export const getAllInspectionProductWithAuth = (req: Request) =>
  erpManufacturingAPI(req).get(`/inspection_product`);

export const getInspectionProductByPkidWithAuth = (
  pkid: number,
  req: Request,
) => erpManufacturingAPI(req).get(`/inspection_product/${pkid}`);

export const getProductionRequestHeaderWithAuth = (req: Request) =>
  erpManufacturingAPI(req).get(`/productionRequest/headers`);

export const getInspectionProductWithAuth = (
  req: Request,
): Promise<{ data: ERPApiResponse<InspectionProductItem> }> =>
  erpManufacturingAPI(req).get(`/inspectionproduct/`);
