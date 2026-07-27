import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet, PetDocument } from './schemas/pet.schema';

// 每小时衰减/恢复多少点，写成常量方便以后调数值。
const HUNGER_DECAY_PER_HOUR = 4;
const MOOD_DECAY_PER_HOUR = 2;
const STAMINA_DECAY_PER_HOUR = 1;

// hunger 或 mood 低于这个值就判定"生病"，Frogger 关卡难度以后会读这个字段。
const SICK_THRESHOLD = 20;

const FEED_HUNGER_GAIN = 30;

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private readonly petModel: Model<PetDocument>) {}

  // 一人一宠物：找不到就自动创建一只新宠物。和 UserService.findOrCreate 是同一个思路。
  async findOrCreateForUser(userId: Types.ObjectId): Promise<PetDocument> {
    const pet = await this.petModel.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, name: '拓麻蛙' } },
      { upsert: true, new: true },
    );
    return this.applyDecay(pet);
  }

  async feed(userId: Types.ObjectId): Promise<PetDocument> {
    const pet = await this.findOrCreateForUser(userId);
    pet.hunger = Math.min(100, pet.hunger + FEED_HUNGER_GAIN);
    pet.lastInteractionAt = new Date();
    return pet.save();
  }

  // 懒计算衰减：不用定时任务扫全表，而是每次读取这只宠物时，
  // 按"现在时间 - 上次互动时间"算出经过了多久，再补扣对应的状态值。
  // 好处：不用额外的后台任务/队列，坏处：如果宠物长期没人看，数值只会在下次被读取时才"批量"扣完——
  // 对宠物养成这种玩法完全够用，先用这个方案，以后有需要再换成定时任务。
  private async applyDecay(pet: PetDocument): Promise<PetDocument> {
    const hoursElapsed = (Date.now() - pet.lastInteractionAt.getTime()) / (1000 * 60 * 60);
    if (hoursElapsed <= 0) return pet;

    pet.hunger = clamp(pet.hunger - HUNGER_DECAY_PER_HOUR * hoursElapsed);
    pet.mood = clamp(pet.mood - MOOD_DECAY_PER_HOUR * hoursElapsed);
    pet.stamina = clamp(pet.stamina - STAMINA_DECAY_PER_HOUR * hoursElapsed);
    pet.isSick = pet.hunger < SICK_THRESHOLD || pet.mood < SICK_THRESHOLD;
    pet.lastInteractionAt = new Date();

    return pet.save();
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
