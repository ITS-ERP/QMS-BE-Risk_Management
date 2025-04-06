import { srmProcurementApi } from '.';

export const getAllSRMProcurement = () =>
  srmProcurementApi.get(`/procurement_srm`);

//1. Keterlambatan RFQ dari purchase request
