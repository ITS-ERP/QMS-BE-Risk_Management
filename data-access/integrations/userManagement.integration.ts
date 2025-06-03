import { Request } from 'express';
import { userManagementAPI } from '.';

export const getTenantByTenantId = (req: Request, tenant_id: string) =>
  userManagementAPI(req).get(`/tenant/${tenant_id}`);
