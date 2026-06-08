// NestJS 内置函数，作用是往路由上贴一个标签（存元数据）。
// 格式是 SetMetadata(key, value)
import { SetMetadata } from "@nestjs/common";  

// 定义一个常量，作为元数据的 key。这个字符串可以随便起，但要保证全局唯一，避免和其他装饰器冲突。
//  jwt.guard.ts 里 Reflector.getAllAndOverride(IS_PUBLIC_KEY, ...) 用的就是这个 key 来读数据。两个文件共用同一个常量，保证 key 一致。
export const IS_PUBLIC_KEY = 'ispublic';

// Public 是一个装饰器工厂函数，调用它会返回一个装饰器。这个装饰器会把元数据 { ispublic: true } 附加到被装饰的目标上（方法或类）。
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

