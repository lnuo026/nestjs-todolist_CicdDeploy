import { Module}  from '@nestjs/common';     
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
     imports: [ TerminusModule],  // 导入 TerminusModule，提供健康检查功能
     controllers: [HealthController],  // 注册健康检查控制器     
})
export class HealthModule {}