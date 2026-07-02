import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from '../todos.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('todos')
export class TodosController {
  // 声明属性+构造函数注入 TodosService
  constructor(private readonly todosService: TodosService) {}

  // 把 findAll 方法绑定到 GET /todos
  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.todosService.findAll(user.id);
  }

  @Get(':id')
  // @Param('id', ...) 提取路径参数 id，并使用 ParseUUIDPipe 验证它是否是有效的 UUID
  // @Param(参数名, 管道列表)
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.todosService.findOne(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTodoDto, @CurrentUser() user: { id: string }) {
    return this.todosService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto, @CurrentUser() user: { id: string }) {
    return this.todosService.update(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.todosService.remove(id, user.id);
  }
}
