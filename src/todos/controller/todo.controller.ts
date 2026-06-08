import{
     Controller,
     Get,
     Post,
     Body,
     Patch,
     Delete,
     Param,
     HttpCode,
     HttpStatus,
}from '@nestjs/common';
import { TodosService } from '../todos.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';


@Controller('todos')
export class TodosController{
     // 声明属性+构造函数注入 TodosService
     constructor( private readonly todosService: TodosService){}
     
     // 把 findAll 方法绑定到 GET /todos
     @Get()
     findAll(){
          return this.todosService.findAll();
     }

     @Get(':id')
     // @Param('id', ...) 提取路径参数 id，并使用 ParseUUIDPipe 验证它是否是有效的 UUID
     // @Param(参数名, 管道列表)
     findOne(@Param('id') id: string){
          return this.todosService.findOne(id);
     }

     @Post()
     @HttpCode(HttpStatus.CREATED)
     create(@Body() dto: CreateTodoDto){
          return this.todosService.create(dto);
     }

     @Patch(':id')
     update(
          @Param('id') id: string,
          @Body() dto: UpdateTodoDto,          
     ){
          return this.todosService.update(id, dto);
     }

     @Delete(':id')
     @HttpCode(HttpStatus.OK)
     remove(@Param('id') id: string){
          return this.todosService.remove(id);
     }
}
