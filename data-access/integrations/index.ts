import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ERP
export const manufacturingApi = axios.create({
  baseURL: process.env.BASE_URL_MANUFACTURING,
});

export const assetApi = axios.create({
  baseURL: process.env.BASE_URL_ASSET,
});

export const inventoryApi = axios.create({
  baseURL: process.env.BASE_URL_INVENTORY,
});

// SRM
export const procurementApi = axios.create({
  baseURL: process.env.BASE_URL_PROCUREMENT,
});

export const contractSRMApi = axios.create({
  baseURL: process.env.BASE_URL_CONTRACT_SRM,
});

// CRM
export const requisitionApi = axios.create({
  baseURL: process.env.BASE_URL_REQUISITION,
});

export const contractCRMApi = axios.create({
  baseURL: process.env.BASE_URL_CONTRACT_CRM,
});
