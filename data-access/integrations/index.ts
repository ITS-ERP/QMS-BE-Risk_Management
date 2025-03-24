import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const otherModuleAPI = axios.create({
  baseURL: process.env.BASE_URL_ANOTHER_MODULE,
});
