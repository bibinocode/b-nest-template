import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userRepository: UsersRepository,
  ) {}

  /**
   * Jwt 签名
   */
  async signin(username: string, password: string) {
    // 验证用户
    const user = await this.validateUser(username, password);

    // 生成 JWT 令牌
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    };
  }

  /**
   * 验证用户
   */
  async validateUser(username: string, password: string) {
    // 通过用户名查找用户
    const user = await this.userRepository.findByUsername(username);

    // 如果用户不存在，抛出异常
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 如果用户被禁用，抛出异常
    if (user.is_active !== 1) {
      throw new UnauthorizedException('账号已被禁用');
    }

    // 验证密码
    const isPasswordValid = await argon2.verify(user.password, password);

    // 如果密码无效，抛出异常
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(userId: number) {
    return this.userRepository.findOne(userId);
  }
}
