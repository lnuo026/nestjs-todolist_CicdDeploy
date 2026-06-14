import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // 接收从 Google 拿到的用户信息，返回数据库里的 User 文档。"找到就返回，找不到就创建"。
  findOrCreate(profile: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { googleId: profile.googleId }, // 查询条件：用 googleId 找
      { $setOnInsert: profile }, // 只有新建时才插入数据（已存在则不改）
      { upsert: true, new: true }, // upsert=找不到就创建，new=返回新数据
    );
  }

  // WT 验证成功后，用 payload 里的 userId 查出完整用户信息。
  // 返回类型加了 | null，因为 id 不存在时 Mongoose 返回 null。
  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
