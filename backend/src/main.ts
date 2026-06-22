import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';

// cookie-parser 是 Express 中间件
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // origin — 允许哪个前端域名跨域访问
  // credentials: true — 允许请求携带 cookie（JWT 存在 cookie 里，必须开这个
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  app.use(helmet()); // 使用 Helmet 增加安全相关的 HTTP 头，防止一些常见的攻击。
  // 把 cookie-parser 注册为全局中间件。之后每个请求进来，它会自动解析 Cookie header，
  // 把结果放进 req.cookies，jwt.strategy.ts 才能读到 req.cookies.access_token

  app.use(cookieParser());

  //Reflector 是读元数据的工具类，JwtAuthGuard 需要它来读取 @Public() 装饰器附加的元数据.
  const reflector = app.get(Reflector);

  // 全局使用 JWT Guard，保护所有路由。除非路由上有 @Public() 装饰器，否则都需要 JWT 验证。
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 全局使用响应拦截器，统一格式化所有成功响应。Controller 里直接 return 数据，拦截器会把它包装成 { data: ..., message: 'ok' } 的格式。
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 所有错误统一输出：statusCode / error / message / timestamp / path
  // 前端只处理一种格式
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局使用验证管道 ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离 DTO 中未定义的属性
      forbidNonWhitelisted: true,
      transform: true, //把请求体的 plain object 自动转成 DTO class 实例。
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
