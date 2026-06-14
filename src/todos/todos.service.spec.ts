import { Test } from '@nestjs/testing';
import { TodosService } from './todos.service';

// NestJS 依赖注入系统里，每个 Provider 有一个 token（令牌） 作为唯一标识。
// Mongoose Model 的 token 是一个特殊字符串，getModelToken('Todo') 就是生成这个字符串。
// 你在 beforeEach 里用它告诉测试模块："当有人需要 Todo 的 Model 时，给他这个假的 {}"。
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodosService;

  // 所有 it() 都能访问
  const mockTodoModel = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    // Test.createTestingModule
    // 创建一个假的 NestJS 环境，只装你指定的东西。
    //真实项目启动时，NestJS 会加载 AppModule、TodosModule、数据库连接等几十个东西。
    // 测试时不需要这些，只需要：
    // TodosService（你要测的东西）
    // 一个假的 todoModel（替代真实数据库）
    const module = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getModelToken(Todo.name),
          useValue: mockTodoModel,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create -done should be false by default', async () => {
    mockTodoModel.create.mockResolvedValue({
      title: 'grocery shopping',
      done: false,
    });

    const result = await service.create({
      title: 'grocery shopping',
    });

    expect(result.done).toBe(false);
  });

  it('findOne - should throw NotFoundException when id not found', async () => {
    // mockReturnValue vs mockResolvedValue
    // 这两个的区别在于返回值是否是 Promise。
    // mockReturnValue(x)直接返回 x，同步的，不是 Promise：
    // mockResolvedValue(x)返回 Promise.resolve(x)，异步的：需要 await
    mockTodoModel.findById.mockReturnValue({
      // 数据库返回 null
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findOne('fakeid')).rejects.toThrow(NotFoundException);
  });

  it('remove -should return deleted: true when success', async () => {
    mockTodoModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: '123' }),
    });

    const result = await service.remove('123');

    // toEqual vs toBe：
    // toBe 比较基本类型（数字、字符串、boolean）
    // toEqual 深度比较对象，{ deleted: true, id: '123' } 是对象，所以用 toEqual
    expect(result).toEqual({ deleted: true, id: '123' });
  });
});
