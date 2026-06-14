import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

// createParamDecorator 接收一个函数，这个函数有两个参数：_data，ctx-通过它拿到 request 对象
// createParamDecorator — NestJS 提供的工厂函数，专门用来创建自定义参数装饰器。你告诉它"从哪里取值"，它返回一个可以贴在参数上的装饰器。
// ExecutionContext — 当前请求的上下文，前面解释过，通过它可以拿到 HTTP request 对象。
// createParamDecorator 接收一个工厂函数，这个函数有两个参数：
// _data — 装饰器调用时传入的参数。比如 @CurrentUser('email') 里的 'email'。我们不需要传参数，所以用 _ 前缀表示忽略，类型写 unknown。
// ctx — 当前请求的上下文。
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    // ctx.switchToHttp() — 把上下文切换到 HTTP 模式（NestJS 还支持 WebSocket、gRPC 等，要先指定是哪种协议）。
    // .getRequest() — 取出原始的 HTTP request 对象，里面有 headers、body、params、user 等所有请求信息。
    // --- getRequest 拿到 Express 的 request 对象
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: unknown }>();

    // 返回值会被注入到 Controller 方法里用 @CurrentUser() 标记的那个参数。
    return request.user; // 这个 user 是 JwtStrategy.validate() 返回的对象，已经是完整的用户信息了。
  },
);
