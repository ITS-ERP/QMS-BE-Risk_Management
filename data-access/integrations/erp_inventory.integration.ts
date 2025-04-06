import { erpInventoryApi } from '.';

export const getAllReceive = () => erpInventoryApi.get(`/receive`);
export const getAllTransfer = () => erpInventoryApi.get(`/transfer`);
