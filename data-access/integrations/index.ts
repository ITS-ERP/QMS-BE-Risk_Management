import axios from 'axios';
import dotenv from 'dotenv';
import { Request } from 'express';
import { getQMSContext } from '../utility/requestHelper';

dotenv.config();

// ERP - Basic instances (keep existing names for backward compatibility)
export const erpInventoryApi = axios.create({
  baseURL: process.env.BASE_URL_ERP_INVENTORY,
});

export const erpManufacturingApi = axios.create({
  baseURL: process.env.BASE_URL_ERP_MANUFACTURING,
});

export const erpAssetApi = axios.create({
  baseURL: process.env.BASE_URL_ERP_ASSET,
});

// ERP with Auth Support - REQUIRED for ERP system access
export const erpInventoryAPI = (req: Request) => {
  const context = getQMSContext(req);
  return axios.create({
    baseURL: process.env.BASE_URL_ERP_INVENTORY,
    headers: {
      Authorization: req.headers.authorization,
      'X-Tenant-ID': context.tenant_id_string,
    },
  });
};

export const erpManufacturingAPI = (req: Request) => {
  const context = getQMSContext(req);
  return axios.create({
    baseURL: process.env.BASE_URL_ERP_MANUFACTURING,
    headers: {
      Authorization: req.headers.authorization,
      'X-Tenant-ID': context.tenant_id_string,
    },
  });
};

export const erpAssetAPI = (req: Request) => {
  const context = getQMSContext(req);
  return axios.create({
    baseURL: process.env.BASE_URL_ERP_ASSET,
    headers: {
      Authorization: req.headers.authorization,
      'X-Tenant-ID': context.tenant_id_string,
    },
  });
};

// SRM
export const srmSupplierPortalApi = axios.create({
  baseURL: process.env.BASE_URL_SRM_SUPPLIER_PORTAL,
});

export const srmProcurementApi = axios.create({
  baseURL: process.env.BASE_URL_SRM_PROCUREMENT,
});

export const srmContractApi = axios.create({
  baseURL: process.env.BASE_URL_SRM_CONTRACT,
});

// CRM
export const crmRequisitionApi = axios.create({
  baseURL: process.env.BASE_URL_CRM_REQUISITION,
});

export const crmContractApi = axios.create({
  baseURL: process.env.BASE_URL_CRM_CONTRACT,
});

// FORECAST - Basic instance (backward compatibility)
export const forecastApi = axios.create({
  baseURL: process.env.BASE_URL_FORECAST,
});

// FORECAST with Auth Support - REQUIRED for authenticated requests
export const forecastAPI = (req: Request) => {
  const context = getQMSContext(req);
  return axios.create({
    baseURL: process.env.BASE_URL_FORECAST,
    headers: {
      Authorization: req.headers.authorization,
      'X-Tenant-ID': context.tenant_id_string,
      'Content-Type': 'application/json',
    },
  });
};

// User Management
export const userManagementAPI = (req: Request) =>
  axios.create({
    baseURL: process.env.BASE_URL_USER_MANAGEMENT,
    headers: {
      Authorization: req.headers.authorization,
    },
  });
