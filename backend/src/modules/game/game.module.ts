import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameRun, GameRunSchema } from './schemas/game-run.schema';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GameRun.name, schema: GameRunSchema }]),
    // 导入 PetModule 才能注入 PetService（结算时要读/改宠物状态）。
    PetModule,
  ],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
