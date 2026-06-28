// Google 登录成功后，google.strategy.ts 把用户信息拿到并存入数据库，
// 接下来需要有人签发 JWT 并写入 Cookie。这就是 auth.service.ts 的职责。

// 它只做一件事：接收 User，生成 JWT，写入 Cookie，返回用户信息。

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: UserDocument, res: Response): UserDocument {
    // payload — 存进 JWT 里的数据，只存 userId，越简单越好
    const payload = { userId: user._id.toString() };

    // jwtService.sign() 方法会根据 payload 和我们在 JwtModule 注册时提供的 secret 生成一个 JWT 字符串。
    // 用 JWT_SECRET 对 payload 加密，生成 JWT 字符串 ,jwtService 内部用了 JWT_SECRET 来加密
    // 所以 JwtStrategy 验证时也要用同一个 JWT_SECRET 来解密，才能成功验证。
    const token = this.jwtService.sign(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 生产环境下才启用 Secure 标志
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return user;
  }

  // 退出登录：删除 Cookie。clearCookie 是 Express 的方法，把指定名字的 Cookie 从浏览器里清除。
  // 之后再请求，jwt.strategy.ts 取不到 Token，返回 401。
  logout(res: Response) {
    res.clearCookie('access_token');
  }
}
