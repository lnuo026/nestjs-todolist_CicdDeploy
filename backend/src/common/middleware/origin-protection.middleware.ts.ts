import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

// 只有这几个方法会修改数据，才需要做 CSRF 防护
const UNSAFE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

@Injectable()
export class OriginProtectionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!UNSAFE_METHODS.includes(req.method)) {
      return next();
    }

    const allowedOrigin = process.env.FRONTEND_URL;

    const origin = req.headers.origin ?? req.headers.referer;

    if (!allowedOrigin || !origin || !origin.startsWith(allowedOrigin)) {
      throw new ForbiddenException('Invalid origin: request must cone from the trusted frontend');
    }
    next();
  }
}
