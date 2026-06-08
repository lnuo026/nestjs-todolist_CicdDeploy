import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


// 从数据库里查出来的 Todo 对象，它比普通 Todo 多了 _id、save()、toObject() 等 Mongoose 内置的属性和方法。
// 定义一个类型别名。以后凡是"从数据库查出来的 Todo"就用 TodoDocument 这个类型，而不是裸的 Todo。这样 TypeScript 知道它有 _id 等属性。
export type TodoDocument = HydratedDocument<Todo>;

export enum TodoPriority {
     LOW = 'low', 
     MEDIUM = 'medium',
     HIGH = 'high',
}

// timestamps: true 让 Mongoose 自动管理 createdAt / updatedAt，不用手动写。
@Schema({ timestamps: true })
export class Todo {
     @Prop({ required:true, maxlength: 255 })
     title!: string;

     @Prop({ maxlength: 2000 })
     description?: string;

     @Prop({ default: false })
     done!: boolean;

     @Prop({ enum: TodoPriority, default: TodoPriority.MEDIUM })
     priority?: TodoPriority;
}

// SchemaFactory 是 NestJS 提供的工具，它做一件事：
// 读取 Todo 类上所有的 @Schema()、@Prop() 装饰器里的配置，把它们转换成 Mongoose 真正能识别的 Schema 对象，存到 TodoSchema 这个变量里。
export const TodoSchema = SchemaFactory.createForClass(Todo);

