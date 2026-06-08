// 一个字符串常量。Passport 注册策略时需要给策略起名字，以后用这个名字引用它。
// pm install @nestjs/passport passport
// passport 是本体，@nestjs/passport 是 NestJS 封装层。
export const JWT_SECRET = 'googleSecret'; 
export const GOOGLE_STRATEGY = 'google';
export const JWT_STRATEGY= 'jwtToken';

