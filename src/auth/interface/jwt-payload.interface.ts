export interface JwtPayload {
  sub: number; // 用户ID
  username: string; // 用户名
  email: string; // 邮箱
  iat?: number; // 签发时间
  exp?: number; // 过期时间
}
