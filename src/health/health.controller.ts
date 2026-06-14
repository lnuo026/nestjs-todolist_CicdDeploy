import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from 'src/common/decorators/public.decorator';

// 把这个控制器挂到 /health 路由前缀。
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  // 处理 GET /health
  @Get()
  // 告诉 Terminus 这是一个健康检查端点。
  @Public()
  @HealthCheck()
  // 执行检查。这里是空数组，表示“只做基本健康检查”。如果要检查 MongoDB/Redis，就往数组里加检查函数。
  check() {
    return this.health.check([]);
  }
}
