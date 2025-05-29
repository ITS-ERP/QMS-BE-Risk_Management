import { srmContractApi } from '.';

export const getAllSRMContract = () => srmContractApi.get(`/contract_srm/`);

export const findTopSuppliersByIndustryID = (pkid: number) =>
  srmContractApi.get(`/qms/topSuppliers/industry/${pkid}`);

export const findTopIndustriesBySupplierID = (pkid: number) =>
  srmContractApi.get(`/qms/topIndustries/supplier/${pkid}`);

export const findTopIndustryItemsByIndustryID = (pkid: number) =>
  srmContractApi.get(`/qms/topIndustryItems/industry/${pkid}`);

export const findTopSupplierItemsByIndustryID = (pkid: number) =>
  srmContractApi.get(`/qms/topSupplierItems/industry/${pkid}`);

export const findTopIndustryItemsBySupplierID = (pkid: number) =>
  srmContractApi.get(`/qms/topIndustryItems/supplier/${pkid}`);

export const findTopSupplierItemsBySupplierID = (pkid: number) =>
  srmContractApi.get(`/qms/topSupplierItems/supplier/${pkid}`);

export const findTotalHistoryShipmentByIndustryAndYear = (
  pkid: number,
  start_date: string,
  end_date: string,
) =>
  srmContractApi.get(
    `/qms/totalHistoryShipment/industry/${pkid}?start_date=${start_date}&end_date=${end_date}`,
  );

export const findTotalHistoryShipmentBySupplierAndYear = (
  pkid: number,
  start_date: string,
  end_date: string,
) =>
  srmContractApi.get(
    `/qms/totalHistoryShipment/supplier/${pkid}?start_date=${start_date}&end_date=${end_date}`,
  );

export const findTotalTargetAndActualTotalPriceByIndustryAndYear = (
  pkid: number,
  start_date: string,
  end_date: string,
) =>
  srmContractApi.get(
    `/qms/totalTargetAndActualTotalPrice/industry/${pkid}?start_date=${start_date}&end_date=${end_date}`,
  );

export const findTotalTargetAndActualTotalPriceBySupplierAndYear = (
  pkid: number,
  start_date: string,
  end_date: string,
) =>
  srmContractApi.get(
    `/qms/totalTargetAndActualTotalPrice/supplier/${pkid}?start_date=${start_date}&end_date=${end_date}`,
  );
