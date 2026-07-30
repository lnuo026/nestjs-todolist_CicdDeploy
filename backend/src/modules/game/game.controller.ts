import { Body, Controller, Param, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { UserDocument } from '../user/schemas/user.schema';
import { GameService } from './game.service';
import { FinishGameDto } from './dto/finish-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // POST /games/start：开一局新游戏，返回这局的难度系数，前端拿去初始化 Canvas。
  @Auth()
  @Post('start')
  start(@CurrentUser() user: UserDocument) {
    return this.gameService.start(user._id);
  }

  // POST /games/:id/finish：游戏在前端跑完之后上报结果，服务器负责写库、结算经验。
  @Auth()
  @Post(':id/finish')
  finish(@CurrentUser() user: UserDocument, @Param('id') id: string, @Body() dto: FinishGameDto) {
    return this.gameService.finish(user._id, id, dto);
  }
}
