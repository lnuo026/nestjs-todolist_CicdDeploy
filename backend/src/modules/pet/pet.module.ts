import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './schemas/pet.schema';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])],
  providers: [PetService],
  controllers: [PetController],
  // 导出 PetService，GameModule 结算对局时要调用 addExp。
  exports: [PetService],
})
export class PetModule {}
