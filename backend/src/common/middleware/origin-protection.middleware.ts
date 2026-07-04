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

    //环境变量读允许的来源,信任的前端地址,只有这个来源的请求才放行
    const allowedOrigin = process.env.FRONTEND_URL;

    const origin = req.headers.origin ?? req.headers.referer;

    // !origin.startsWith(allowedOrigin) — 来源不是以前端地址开头(说明请求来自别的网站,可能是攻击,拒绝)
    if (!allowedOrigin || !origin || !origin.startsWith(allowedOrigin)) {
      throw new ForbiddenException('Invalid origin: request must come from the trusted frontend');
    }
    next();
  }
}
