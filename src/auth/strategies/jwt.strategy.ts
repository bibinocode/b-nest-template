import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')!,
    });
  }

  /**
   * 验证 JWT 载体
   * @param payload JWT 载体
   * @returns 返回的数据会被挂在到 request 对象上
   */
  async validate(payload: JwtPayload) {
    console.log('🚀 当前 JWT 载体', payload);
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}
