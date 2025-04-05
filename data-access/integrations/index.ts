import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const manufacturingApi = axios.create({
  baseURL: process.env.BASE_URL_MANUFACTURING,
});

export const assetApi = axios.create({
  baseURL: process.env.BASE_URL_ASSET,
});

export const inventoryApi = axios.create({
  baseURL: process.env.BASE_URL_INVENTORY,
});
