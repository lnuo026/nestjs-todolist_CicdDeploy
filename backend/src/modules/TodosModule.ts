import { Module } from '@nestjs/common';
import { TodosController } from 'src/todos/controller/todo.controller';
import { TodosService } from 'src/todos/todos.service';
// 导入 MongooseModule，它提供了 forFeature() 方法，用来告诉 Mongoose "这个模块要用哪些 Schema"
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from 'src/todos/schemas/todo.schema';

// 在当前模块范围内注册 Schema，让这个模块里的 Service 可以注入对应的 Model
// forFeature = 申请某个房间的权限，才能进那个房间操作
// Todo.name 就是字符串 'Todo'，Mongoose 用这个名字创建 collection（默认会变成小写复数 todos
// schema: TodoSchema — 用这个 Schema 定义文档结构
// 为什么是数组 [{ ... }] 因为一个模块可能同时用多张表：
@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
