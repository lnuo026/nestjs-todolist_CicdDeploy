import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { UserService } from "src/modules/user/user.service";
import {GOOGLE_STRATEGY} from "src/common/constants/auth.constants";
import { GoogleUser } from "../types/google-user.type";

@Injectable()
// PassportStrategy() 是 NestJS 提供的函数，把 Passport 的原生 Strategy 包装成 NestJS 可以管理的类。
// 第二个参数 GOOGLE_STRATEGY（就是字符串 'google'）是策略的注册名。
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_STRATEGY){
     constructor(
          config: ConfigService,
          private readonly userService: UserService,
     ) {
          // 调用父类构造函数，传入 Google OAuth 需要的配置
          // <> 是 TypeScript 的泛型
          // 三个 config.get 后面都加 !（非空断言），告诉 TypeScript"这个值一定存在"（Joi 已经保证必填了）
          // 应用启动时如果没有这个变量会直接报错拒绝启动。所以运行到这里时它一定有值。
          // ! 告诉 TypeScript："我保证这个值不是 undefined"
          super({
               clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
               clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
               callbackURL: config.get<string>('GOOGLE_CALLBACK_URL')!,
               scope: ['email', 'profile'],
               passReqToCallback: false, // 不需要把 Request 对象传给 validate()，所以设为 false
          });
     }

     // Google 授权成功后自动调用这个方法。参数是 Passport 固定传入的
     // _accessToken — Google 的访问令牌（我们不用，加 _ 前缀表示忽略）
     // _refreshToken — Google 的刷新令牌（我们也不用）
     // profile — Google 返回的用户信息原始数据
     // done — 回调函数，告诉 Passport"验证结果是什么"
     async validate(
          _accessToken: string,    
          _refreshToken: string,
          profile: any,
          done: VerifyCallback,
     ): Promise<void> {
          const googleUser: GoogleUser = {
               googleId: profile.id,
               email: profile.emails[0].value,
               //  Google 返回的 profile 对象里的name字段，Passport 帮你整理好
               name: profile.displayName,
               picture: profile.photos?.[0]?.value,
          };
          const user = await this.userService.findOrCreate(googleUser);
          // Passport 的回调约定，固定格式：done(错误, 用户数据)
          // (null, user)      // 成功：没有错误，用户是 user
          // (new Error(), null) // 失败：有错误，没有用户
          done(null, user);

     }
}