// 提供 GET /users/profile 接口，让已登录用户查看自己的信息。这是验证整条 Auth 链路是否通畅的关键接口——能调通说明 Google 登录、JWT 签发、JWT 验证全部工作正常。

import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { UserDocument } from './schemas/user.schema';

// 这个 Controller 处理所有 /users/* 路由。
@Controller('users')
export class UserController {
  @Auth() // 这个装饰器是 @Public() 的反义词，标记这个路由需要 JWT 验证
  @Get('profile') // GET /users/profile
  getProfile(@CurrentUser() user: UserDocument) {
    return user; // 直接返回当前用户信息，看看 JWT 验证和 CurrentUser 装饰器能不能正确工作
  }
}

// eturn user;
// 直接返回用户对象。经过 ResponseInterceptor 包装后，客户端收到的是：
// // {
//   "data": {
//     "_id": "...",
//     "email": "user@gmail.com",
//     "name": "张三",
//     "picture": "https://...",
//     "createdAt": "..."
//   },
//   "message": "ok"
// }
