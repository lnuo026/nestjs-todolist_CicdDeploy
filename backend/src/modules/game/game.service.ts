import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GameRun, GameRunDocument } from './schemas/game-run.schema';
import { PetService } from '../pet/pet.service';
import { FinishGameDto } from './dto/finish-game.dto';

// 赢/输各给多少经验，简单常量，先跑通链路，以后要做平衡性调整就改这里。
const WIN_EXP = 20;
const LOSE_EXP = 5;

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameRun.name) private readonly gameRunModel: Model<GameRunDocument>,
    private readonly petService: PetService,
  ) {}

  // 开局：读一次宠物当前状态（懒衰减也会顺带算好），把"饥饿/心情/体力"平均值换算成难度系数。
  // 状态越差 → 难度越高，这就是 PLAN.md 里说的"养成状态直接影响关卡难度"。
  async start(userId: Types.ObjectId) {
    const pet = await this.petService.findOrCreateForUser(userId);
    const avgStat = (pet.hunger + pet.mood + pet.stamina) / 3;
    // avgStat=100（状态拉满）→ modifier=1.0（最简单）；avgStat=0（濒死）→ modifier=2.0（最难）。
    const difficultyModifier = 1 + (100 - avgStat) / 100;

    const gameRun = await this.gameRunModel.create({
      userId,
      petId: pet._id,
      difficultyModifier,
    });

    return { gameRunId: String(gameRun._id), difficultyModifier };
  }

  // 结算：前端游戏跑完之后上报结果，这里写回数据库并给宠物发经验。
  // 关键校验：只能结算属于当前用户、还处于 in_progress 的对局，防止重复结算或结算别人的对局。
  async finish(userId: Types.ObjectId, gameRunId: string, dto: FinishGameDto) {
    const gameRun = await this.gameRunModel.findOne({ _id: gameRunId, userId });
    if (!gameRun) throw new NotFoundException('对局不存在');
    if (gameRun.outcome !== 'in_progress') {
      throw new BadRequestException('这局已经结算过了');
    }

    gameRun.outcome = dto.outcome;
    gameRun.score = dto.score;
    gameRun.endedAt = new Date();
    await gameRun.save();

    const expGained = dto.outcome === 'win' ? WIN_EXP : LOSE_EXP;
    const pet = await this.petService.addExp(gameRun.petId, expGained);

    return {
      outcome: gameRun.outcome,
      score: gameRun.score,
      expGained,
      petLevel: pet.level,
    };
  }
}
