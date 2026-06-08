// 先建User Schema？
// Auth 模块的核心逻辑是"Google 登录后，找到或创建这个用户"。必须先有 User 的数据库模型，Auth 才能操作用户数据。

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User{
     // unique: true 让 MongoDB 建索引，防止同一个 Google 账号被创建两次。这是识别"同一个人再次登录"的关键字段。
     @Prop({ required: true, unique: true })
     googleId!: string;
     
     @Prop({required: true ,unique: true})
     email!: string;

     @Prop({ required: true })
     name!: string;

     @Prop()
     picture?: string;
}

     // SchemaFactory.createForClass(User)
     // 把你写的 User 类（带装饰器）转换成 Mongoose 能识别的 Schema 对象。
     // 结果：UserSchema 是一个 Mongoose Schema 对象
     // 只做一件事：类 → Schema 对象。
     export const UserSchema = SchemaFactory.createForClass(User);
     
     
     // MongooseModule.forFeature([...])在 module.ts 里用。
     // 把已经转换好的 Schema 注册到当前模块，让 NestJS 知道这个模块要用这张表，并自动创建 Model 供 Service 注入。