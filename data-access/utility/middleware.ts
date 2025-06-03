import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces';

export class SimpleQMSMiddleware {
  public static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      console.log(`🔐 Simple QMS Auth: ${req.method} ${req.path}`);

      // Extract token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          isSuccess: false,
          message: 'Access token diperlukan. Harap login terlebih dahulu.',
          data: null,
        });
      }

      const token = authHeader.split(' ')[1];

      // FIX: Get JWT_SECRET directly from process.env setiap kali
      const jwtSecret = process.env.JWT_SECRET;

      // Debug logging
      console.log('🔍 JWT_SECRET exists:', !!jwtSecret);
      console.log('🔍 JWT_SECRET length:', jwtSecret?.length);

      // Verify JWT
      if (!jwtSecret) {
        console.error('❌ JWT_SECRET not found in environment variables');
        return res.status(500).json({
          isSuccess: false,
          message: 'JWT secret not configured',
          data: null,
        });
      }

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded.user_id || !decoded.tenant_id) {
        return res.status(401).json({
          isSuccess: false,
          message: 'Token tidak valid atau sudah expired',
          data: null,
        });
      }

      console.log(
        `✅ Simple QMS Auth Success - User: ${decoded.user_username}, Tenant: ${decoded.tenant_id}`,
      );

      next();
    } catch (error) {
      console.error('❌ Simple QMS Auth error:', error);
      return res.status(401).json({
        isSuccess: false,
        message: 'Token tidak valid atau sudah expired',
        data: null,
      });
    }
  }
}
