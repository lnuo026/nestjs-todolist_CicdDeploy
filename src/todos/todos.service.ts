import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Model } from 'mongoose';
import { Todo, TodoDocument, TodoPriority } from './schemas/todo.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodosService {
  constructor(
    // "把名字叫 'Todo' 的 Model 注入进来"
    // 存到实例属性，所有方法都通过它操作数据库
    // 这里的 Todo.name 必须和 forFeature 里注册的名字一致，否则找不到
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  // 查询 todos collection 里的所有文档，不加条件就是全部
  // .exec() — 执行这个查询，返回 Promise
  // 返回值是 Promise<TodoDocument[]>，因为 Mongoose 操作是异步的，最终会得到一个 TodoDocument 数组。
  findAll(): Promise<TodoDocument[]> {
    return this.todoModel.find().exec();
  }

  async findOne(id: string): Promise<TodoDocument> {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  // 在数据库里新建一条文档，返回创建好的文档
  // 把 DTO 的字段展开
  create(dto: CreateTodoDto): Promise<TodoDocument> {
    return this.todoModel.create({
      ...dto,
      done: false,
      priority: dto.priority || TodoPriority.MEDIUM,
    });
  }

  async update(id: string, dto: UpdateTodoDto): Promise<TodoDocument> {
    //  默认返回更新前的旧数据，加了这个才返回更新后的新数据
    // timestamps: true 已经在 Schema 里设了
    const todo = await this.todoModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async remove(id: string): Promise<{ deleted: true; id: string }> {
    const result = await this.todoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return { deleted: true, id };
  }
}
