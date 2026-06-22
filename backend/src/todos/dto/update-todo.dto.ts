import { TodoPriority } from '../schemas/todo.schema';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';

// PATCH 语义 = 部分更新。用户可能只想改一个字段：所有字段都是可选
export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MaxLength(225)
  title?: string;
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;
  @IsBoolean()
  @IsOptional()
  done?: boolean;
  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority;
}
