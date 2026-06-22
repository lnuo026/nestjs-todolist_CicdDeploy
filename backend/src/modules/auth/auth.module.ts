// 把 Auth 模块所有的零件（Strategy、Guard、Service、Controller）装配在一起，
// 同时注册 JwtModule 和 PassportModule，并导入 UserModule 获取 UserService。

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  // PassportModule,注册 Passport，让整个 Auth 模块能使用 Passport 的功能。
  // 没有它，PassportStrategy、AuthGuard 都无法工作。它是 Passport 在 NestJS 里的"总开关"。
  // 导入 UserModule。因为 UserModule 里 exports: [UserService]，
  // 导入后 GoogleStrategy 和 JwtStrategy 就能注入 UserService，调用 findOrCreate() 和 findById()。
  imports: [
    PassportModule,
    UserModule,
    // registerAsync — 异步注册，等 ConfigService 准备好再读环境变量
    // 注册后，AuthService 里注入的 JwtService 就会自动用这个 secret 签发 Token。
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? ('7d' as any),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  // AuthService — 签发 JWT 和退出登录
  // GoogleStrategy — Passport 会自动发现并注册名为 'google' 的策略
  // JwtStrategy — Passport 会自动发现并注册名为 'jwt' 的策略
  // 两个 Strategy 必须在这里注册，Passport 才能在收到 AuthGuard('google') 或 AuthGuard('jwt') 时找到它们。
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
