import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GOOGLE_STRATEGY } from "../../../common/constants/auth.constants";

@Injectable()
// 这个类就是一个简单的包装，告诉 NestJS：这是一个 AuthGuard，底层用 GoogleStrategy 来验证用户。
// AuthGuard 是 @nestjs/passport 提供的工厂函数，传入策略名就会生成一个对应的 Guard。
// 这行代码的意思是：当请求到达被这个 Guard 保护的路由时，启动 'google' 策略
export class GoogleAuthGuard extends AuthGuard(GOOGLE_STRATEGY){}