import { Test, TestingModule } from '@nestjs/testing';
import * as http from 'http';
import { INestApplication } from '@nestjs/common';
// supertest 是一个 HTTP 测试库，作用是：
// 在测试里发 HTTP 请求，不需要真的开浏览器。
// supertest 拿到你的 NestJS HTTP 服务器实例，直接在内存里发请求，不需要真实的网络连接，也不需要监听端口。
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App(e2e)', () => {
  let app: INestApplication;

  //  AppModule 为什么是 imports 不是 providers
  //单元测试用 providers,只装需要的东西
  // e2e 测试用 imports：装整个应用，和真实启动一样 ,因为 e2e 要测完整链路，所以要加载完整的应用。
  // AppModule 里有所有模块、数据库连接、守卫等
  // e2e 测试加载了 AppModule，意味着它会真实连接 MongoDB Atlas。.env 里有 MONGODB_URI，测试时会用这个连接真实数据库。这在生产级项目里是正常的，e2e 测试就是要测真实链路。但 /health 路由不涉及数据库，所以这个测试是安全的。
  beforeEach(async () => {
    // beforeEach 每个 it() 运行前，启动一个全新的 NestJS 应用
    // 保证每个测试都是干净的状态，互不影响
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /health - should return 200', () => {
    return (
      //supertest 的 request() 期望一个具体类型 http.Server。把 any 传给期望有类型的参数，触发 no-unsafe-argument
      request(app.getHttpServer() as http.Server)
        // /health 为什么能通过 ,之前给 /health 加了 @Public() 装饰器，所以不需要 JWT token 就能访问，e2e 测试直接发请求就能拿到 200。
        // 如果没有 @Public()，请求会被 JwtAuthGuard 拦截，返回 401，测试失败。
        .get('/health')
        .expect(200)
    );
  });

  afterEach(async () => {
    // afterEach 每个 it() 运行后，关闭应用
    // 原因：NestJS 启动后会占用内存和数据库连接
    // 不关闭的话，多个测试同时开着多个应用会互相干扰
    await app.close();
  });
});
