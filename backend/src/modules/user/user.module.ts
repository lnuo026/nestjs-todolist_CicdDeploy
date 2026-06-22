import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  // forFeature 注册 User Schema，让 UserService 可以用 @InjectModel 拿到 UserModel。
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
  // 把 UserService 共享出去,Auth 模块登录成功后需要调用 UserService.findOrCreate()，如果不 export，Auth 模块拿不到 UserService。
  exports: [UserService],
})
export class UserModule {}
