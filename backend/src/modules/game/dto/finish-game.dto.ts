import { IsIn, IsInt, Min } from 'class-validator';

export class FinishGameDto {
  @IsIn(['win', 'lose'])
  outcome!: 'win' | 'lose';

  @IsInt()
  @Min(0)
  score!: number;
}
