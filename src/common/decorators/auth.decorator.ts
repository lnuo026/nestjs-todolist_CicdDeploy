// @Auth()它是一个组合装饰器——把多个装饰器合并成一个，
// 让路由保护的写法更简洁，以后如果要在所有受保护路由上统一加新功能（比如限流），只改 @Auth() 一处即可。

import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';

// Auth 是一个函数，调用时返回 applyDecorators(...) 的结果。
// 现在只组合了一个 UseGuards，但这个结构的价值在于可扩展性，以后如果要在所有受保护路由上统一加新功能（比如限流），只改 @Auth() 一处即可。
//applyDecorators -  NestJS 内置函数，把多个装饰器合并成一个。传入任意数量的装饰器，返回一个新装饰器，效果等同于把所有装饰器叠在一起。
export const Auth = () =>
  applyDecorators(
    // UseGuards — NestJS 内置装饰器，告诉 NestJS 这个路由要经过哪个 Guard 验证。
    UseGuards(JwtAuthGuard),
  );
