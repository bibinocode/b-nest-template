/**
 * Request Jwt 解密后的载荷
 */
declare namespace Express {
  interface Request {
    user: {
      userId: number;
      username: string;
      email: string;
    };
  }
}
