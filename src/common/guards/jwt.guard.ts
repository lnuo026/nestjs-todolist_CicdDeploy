// 文件在 src/common/guards/。因为这是全局守卫，属于公共层，不属于 auth 模块。

// NestJS 内置类，代表当前请求的上下文。它封装了请求的所有信息，让你能拿到请求对象、响应对象、路由信息等。
// Guard、Interceptor、Pipe 都会收到它，是 NestJS 中"了解当前请求在哪里"的标准方式。
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// NestJS 内置工具类，专门用来读取装饰器附加的元数据。
import { Reflector } from "@nestjs/core";
import { JWT_STRATEGY } from "../constants/auth.constants";
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
// 基于 JWT 策略的 Guard，和 GoogleAuthGuard 结构一样，但这个是全局的，保护所有路由。
// 有些路由我想标记成"公共的",让它们跳过 JWT 验证。这个例外逻辑,空壳子做不到
// 所以覆写(override)了父类的方法,把自己的判断塞了进去。
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {   //AuthGuard(JWT_STRATEGY) @nestjs/passport 提供的工厂函数，传入策略名，返回一个 Guard 类：
     // Reflector 是 NestJS 提供的工具，用来读取装饰器附加的元数据
     constructor (private reflector: Reflector){
          super();
     }

     // canActivate: Guard 的核心方法，NestJS 每次请求都会自动调用它
     // 为了插入 @Public() 判断，覆写了这个方法
     canActivate(context: ExecutionContext) {
          //getAllAndOverride: Reflector 的方法，从多个目标上读取元数据，优先返回第一个找到的值 ,先查方法上有没有, 再查类上有没有
          const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
               context.getHandler(),  //当前请求的上下文,当前被调用的方法（比如 findAll）
               context.getClass(),  //当前被调用的类（比如 TodosController）
          ]);
          if(isPublic)return true; // 如果是公共路由，直接放行，不需要验证
          return super.canActivate(context); // 否则走正常的 JWT 验证流程
     }
          
     }


