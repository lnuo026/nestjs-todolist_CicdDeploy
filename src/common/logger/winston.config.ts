// 从 nest-winston 拿工具函数。这里主要用它的 format.nestLike() 来输出类似 Nest 原生日志风格。
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
// 把 winston 整个库导入成对象 winston。后面会用它创建 transports 和 format
import * as winston from 'winston';

// timestamp()：每条日志带时间
// ms()：记录耗时
// nestLike()：让日志格式更像 Nest 默认风格（便于阅读）
export const winstonConfig = {
  // 设置日志最低级别为 info。
  // 意味着：info、warn、error 会输出；debug 不会输出。
  // 生产环境常用 info，本地调试可改为 debug
  level: 'info',
  transports: [
    // transports 就是“日志输出通道”。
    // Winston 支持输出到：console、文件、HTTP、数据库等。
    // 这里只配置一个 Console
    new winston.transports.Console({
      // 日志格式组合器
      format: winston.format.combine(
        winston.format.timestamp(),
        // 给日志添加耗时字段
        winston.format.ms(),
        // 把日志格式化成 “Nest 风格”。
        // "TodosApp" 是日志前缀，让输出更易读
        nestWinstonModuleUtilities.format.nestLike('Todolist', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
};
