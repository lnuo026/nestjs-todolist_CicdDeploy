import { Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { UserDocument } from '../user/schemas/user.schema';
import { PetService } from './pet.service';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  // GET /pets/me：拿当前用户的宠物，没有就自动创建一只。
  // Service 里已经顺带算好了衰减，这里拿到的状态值就是"此刻应该是多少"。
  @Auth()
  @Get('me')
  getMyPet(@CurrentUser() user: UserDocument) {
    return this.petService.findOrCreateForUser(user._id);
  }

  // POST /pets/me/feed：喂食动作，hunger 加分。
  @Auth()
  @Post('me/feed')
  feed(@CurrentUser() user: UserDocument) {
    return this.petService.feed(user._id);
  }
}
