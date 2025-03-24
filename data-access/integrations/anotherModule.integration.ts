import { otherModuleAPI } from '.';

export const getDataFromOtherModule = (code: string) =>
  otherModuleAPI.get(`/test/${code}`);
