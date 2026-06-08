import * as Joi from 'joi';

// 用 @nestjs/config + Joi 做校验，validation.ts 是“必填配置清单”。
// joi 是一个数据校验库，专门用来“验证输入是否符合规则”。
     // validation.ts 用 Joi 校验所有环境变量，新变量必须在这里声明，否则启动时 Joi 会报"未知字段"或"缺少必填字段"的错误。
// 把 MONGODB_URI 写进去的作用是：
// 防止忘记配置 ，明确依赖：一眼看出服务必须有数据库连接，不会在生产环境“静默失败”。
export const validationSchema = Joi.object({
     NODE_ENV: Joi.string()
     .valid("development", "production", "test")
     .default("development"),
     PORT: Joi.number().default(3000), 
     MONGODB_URI: Joi.string()
     .uri({ scheme: ['mongodb', 'mongodb+srv' ]}) 
     .required(),
     // 两个是从 Google Cloud Console 拿到的凭证，必填，格式是普通字符串。
     GOOGLE_CLIENT_ID: Joi.string().required(),
     GOOGLE_CLIENT_SECRET: Joi.string().required(),

     // 回调地址必须是合法的 URL 格式
     GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
     
     // JWT 签名密钥
     JWT_SECRET: Joi.string().min(16).required(),
     
     // Token 有效期，不填则默认 '7d'（7天）。'7d'、'24h'、'30m' 都是合法格式。
     JWT_EXPIRES_IN: Joi.string().default('7d'),
});