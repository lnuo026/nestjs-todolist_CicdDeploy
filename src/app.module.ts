import { ThrottlerModule } from "@nestjs/throttler";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { WinstonModule } from "nest-winston";
import { HealthModule } from "./health/health.module";


import { validationSchema } from "./config/validation";
import { winstonConfig } from "./common/logger/winston.config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TodosModule } from "./modules/TodosModule";

import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";


// ConfigModule.forRoot(...) 会在应用启动时读取环境变量，并用你在 validation.ts 定义的规则校验
// isGlobal: true 让你在任意模块里都能直接注入 ConfigService，无需每个模块都写 imports: [ConfigModule]
@Module({
  imports: [
    // 防止暴力攻击
    ThrottlerModule.forRoot([{
      // ttl 是 time-to-live，时间窗口。意思是：每个 IP 在 60 秒内最多请求 100 次，超过返回 429。
      ttl:60000,
      limit:100,
    }]),



    //  负责加载和校验环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),

    // 异步加载 MongooseModule，等 ConfigService 解析完环境变量后再使用它来配置 MongoDB 连接
    MongooseModule.forRootAsync({
      // "这个工厂函数需要 ConfigModule 提供的东西"
      imports: [ConfigModule],

      // "具体注入 ConfigService 到工厂函数"
      inject:[ConfigService],

      // "工厂函数定义如下：接收 ConfigService 作为参数，返回一个对象"
      // 一个工厂函数。NestJS 启动时调用它，它返回 MongooseModule 需要的配置对象。
      // 在这里我们用工厂函数先注入 ConfigService，再从中读 URI。
      useFactory:(config: ConfigService)=>({

        // 工厂函数内部：从 ConfigService 读 MONGODB_URI，包装成 { uri: "..." } 对象返回。
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    //  注册日志系统,让 Nest 的日志输出走 Winston。
    WinstonModule.forRoot(winstonConfig),
    HealthModule, 
    TodosModule,
    AuthModule,
    UserModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}