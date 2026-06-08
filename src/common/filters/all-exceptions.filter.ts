import {
     ArgumentsHost,
     Catch,
     ExceptionFilter,
     HttpException,
     HttpStatus,
}from '@nestjs/common';

import { Request, Response } from "express"; 

// @Catch() 表示“捕获所有异常”（不传具体异常类型）
@Catch()
export class AllExceptionsFilter implements ExceptionFilter{
     // catch() 方法拿到请求与响应
     catch(exception: unknown, host: ArgumentsHost) {
          // host 是 Nest 传进来的上下文,switchToHttp() 把它转成 HTTP 场景。
          // 然后就拿到 request 和 response，用于读取 URL 和返回 JSON。
          const ctx = host.switchToHttp();
          const response = ctx.getResponse<Response>();
          const request = ctx.getRequest<Request>();

          // 判断异常是不是 HttpException,HttpException 是 Nest 自带的错误类（如 BadRequestException）。
          // 如果是它，就用它自己的状态码；否则一律按 500 处理。
          const isHttpException = exception instanceof HttpException;
          const status = isHttpException
          ? exception.getStatus()
          :HttpStatus.INTERNAL_SERVER_ERROR;

          // 提取错误信息
          // Nest 的异常有时返回字符串，有时是对象。
          // 这里做了兼容：不管是哪种，都能拿到 message。
          const exceptionResponse = isHttpException
          ? exception.getResponse()
          : { message: "Internal Server Error"};

          const message = 
          typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as { message?: string | string[] })
          .message || "Internal Server Error";

          response.status(status).json({
               statusCode: status,
               error: isHttpException ? exception.name : "InternalServerError",
               message,
               timestamp: new Date().toISOString(),
               path: request.url,
          });  
     }
}
