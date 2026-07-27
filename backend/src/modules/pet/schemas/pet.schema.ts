// Pet Schema：拓麻青蛙的宠物养成状态。
// 每个 User 对应一只 Pet（一对一），用 userId 关联，不改动现有 User Schema，保持 auth/user 模块原样不动。

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PetDocument = HydratedDocument<Pet>;

// 生命阶段，仿拓麻歌子的成长曲线。MVP 阶段先固定从 'baby' 开始，
// 'egg' → 'baby' 的孵化逻辑和后续进化留到做 AI 造型生成那一阶段再实现。
export type PetStage = 'egg' | 'baby' | 'adult' | 'elder';

@Schema({ timestamps: true })
export class Pet {
  // ref: 'User' 让 Mongoose 知道这个字段指向 users 集合，之后可以用 .populate('userId') 拿到完整用户信息。
  // unique: true 保证一个用户目前只能有一只宠物（MVP 简化：一人一宠物）。
  @Prop({ required: true, unique: true, ref: 'User', type: Types.ObjectId })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, enum: ['egg', 'baby', 'adult', 'elder'], default: 'baby' })
  stage!: PetStage;

  // 0-100，随时间衰减，靠喂食恢复。
  @Prop({ required: true, default: 100, min: 0, max: 100 })
  hunger!: number;

  // 0-100，随时间衰减，Phase 3 加"玩耍"动作后可以恢复。
  @Prop({ required: true, default: 100, min: 0, max: 100 })
  mood!: number;

  // 0-100，随时间缓慢衰减，Phase 3 对战/游戏会消耗和恢复它。
  @Prop({ required: true, default: 100, min: 0, max: 100 })
  stamina!: number;

  // hunger 或 mood 过低时置为 true，后续 Frogger 关卡难度会读这个字段。
  @Prop({ required: true, default: false })
  isSick!: boolean;

  // 升级/经验值：Phase 2 单人 Frogger 结算分数时会往这里写，目前先建好字段。
  @Prop({ required: true, default: 1 })
  level!: number;

  @Prop({ required: true, default: 0 })
  exp!: number;

  // 上一次互动（喂食/玩耍等）的时间点，用来计算"离线了多久、该衰减多少"。
  @Prop({ required: true, default: () => new Date() })
  lastInteractionAt!: Date;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
