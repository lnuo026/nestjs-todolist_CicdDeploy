// 用 interface 而不是 class，因为这只是一个类型描述，不需要实例化，不需要装饰器
// 纯粹告诉 TypeScript"这个对象有哪些字段"。
// 用户用 Google 登录后,Google 会返回一堆用户信息(id、邮箱、名字、头像……)。
// 你的 google.strategy.ts 会接住这些信息,然后整理成一个干净的对象往后传。
// GoogleUser 这个 interface 就是用来约定"整理后的那个对象应该长什么样",
// 让后续每一处用到它的代码(Strategy、Service、控制器)都对"这个对象有哪些字段"有一致、可靠的认知。
// 一句话:它是这条认证流水线上传递的"用户数据包"的规格说明书。
export interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}
