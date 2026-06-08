//NestJS 的拦截器基于 RxJS（响应式编程库）
import {
     CallHandler,
     ExecutionContext,
     Injectable,
     NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {

     // Observable — 代表"一个异步数据流"，可以用操作符链式处理
     // map — RxJS 操作符，作用和数组的 .map() 一样：把每个值转换成另一个值
     // next — 代表"后续的处理链"，调用 next.handle() 就是"继续执行，把结果给我"
     // 返回 Observable<unknown> — 返回一个处理过的数据流
     intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown>{
          return next.handle().pipe(
               map((data) => ({
                    data,
                    message: 'ok',
               }))
          )
     }
}