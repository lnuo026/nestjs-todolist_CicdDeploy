// GameRun：一局单人 Frogger 的记录。
// difficultyModifier 是开局那一刻读取宠物状态算出来的系数，记下来是为了以后能查"这局到底有多难"。

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GameRunDocument = HydratedDocument<GameRun>;
export type GameOutcome = 'in_progress' | 'win' | 'lose';

@Schema({ timestamps: true })
export class GameRun {
  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId!: Types.ObjectId;

  @Prop({ required: true, ref: 'Pet', type: Types.ObjectId })
  petId!: Types.ObjectId;

  @Prop({ required: true })
  difficultyModifier!: number;

  @Prop({ required: true, default: 0 })
  score!: number;

  // 'in_progress' → 开局时的初始状态，客户端结算时会传 'win'/'lose' 把它改掉。
  @Prop({ required: true, enum: ['in_progress', 'win', 'lose'], default: 'in_progress' })
  outcome!: GameOutcome;

  @Prop()
  endedAt?: Date;
}

export const GameRunSchema = SchemaFactory.createForClass(GameRun);
