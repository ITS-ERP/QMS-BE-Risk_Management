import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ERP
export const erpInventoryApi = axios.create({
  baseURL: process.env.BASE_URL_ERP_INVENTORY,
});

export const erpManufacturingApi = axios.create({
  baseURL: process.env.BASE_URL_ERP_MANUFACTURING,
});

export const erpAssetApi = axios.create({
  baseURL: process.env.BASE_URL_ERP_ASSET,
});

// SRM
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
