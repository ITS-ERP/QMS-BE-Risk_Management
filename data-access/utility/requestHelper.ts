import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces';

export interface SimpleQMSContext {
  user_id: string;
  tenant_id_string: string;
  tenant_id_number: number;
  user_username: string;
  role_id: string;
}

export const getQMSContext = (req: Request): SimpleQMSContext => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header tidak ditemukan');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const tenant_id_string = decoded.tenant_id;
    const tenant_id_number = parseInt(tenant_id_string, 10);

    if (isNaN(tenant_id_number)) {
      throw new Error(`Invalid tenant_id format: ${tenant_id_string}`);
    }

    console.log('🔍 Simple QMS Context:', {
      user_id: decoded.user_id,
      tenant_id_number: tenant_id_number,
      user_username: decoded.user_username,
      role_id: decoded.role_id,
    });

    return {
      user_id: decoded.user_id,
      tenant_id_string: tenant_id_string,
      tenant_id_number: tenant_id_number,
      user_username: decoded.user_username,
      role_id: decoded.role_id,
    };
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
};
