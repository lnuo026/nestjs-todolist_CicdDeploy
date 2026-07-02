import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_STRATEGY } from 'src/common/constants/auth.constants';
import { UserService } from 'src/modules/user/user.service';
import type { Request } from 'express';

@Injectable()
// 和 Google Strategy 一样的结构，只是这次用的是 passport-jwt 的 Strategy，注册名是 'jwt'
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      // 告诉 Passport：从哪里取出 JWT。这里我们从 Cookie 里取
      // 名字叫 access_token。ExtractJwt 是 passport-jwt 提供的工具。
      // ??  null 是：如果 Cookie 里没有这个字段，返回 null
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req?.cookies as Record<string, string> | undefined)?.['access_token'] ?? null,
      ]),
      // 验证 JWT 签名用的密钥。签发时用这个密钥加密，验证时用同一个密钥解密。两边必须一致，否则验证失败。
      secretOrKey: config.get<string>('JWT_SECRET')!,
      // Token 过期了就拒绝，返回 401。生产环境必须设为 false
      ignoreExpiration: false, // JWT过期后不接受，需要重新登录获取新 token
    });
  }

  // 就是当初签发时存进去的用户 id
  // 用这个 id 查数据库，确认用户真实存在
  // 找不到就抛 UnauthorizedException（返回 401）
  // 找到了就 return user，这个 user 会自动放进 req.user，供后续处理器使用。
  async validate(payload: { userId: string }) {
    const user = await this.userService.findById(payload.userId);
    if (!user) throw new UnauthorizedException();
    return user; // 成功验证后，Passport 会把这个 user 对象挂到 Request 上，供后续处理器使用。
  }
}
