import { inventoryApi } from '.';

export const getAllReceive = () => inventoryApi.get(`/receive`);
export const getAllTransfer = () => inventoryApi.get(`/transfer`);
