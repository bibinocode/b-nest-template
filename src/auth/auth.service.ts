import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import * as argon2 from 'argon2';
import { JwtPayload } from './interface/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userRepository: UsersRepository,
  ) {}

  /**
   * 验证用户
   */
  async validateUser(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    // 查找用户
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }

    // 检查用户状态
    if (user.is_active !== 1) {
      throw new BadRequestException('账号已被禁用');
    }

    // 使用 argon2 验证密码
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('用户名或密码错误');
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * JWT 签名
   * @param user 用户信息
   */
  async signin(user: { id: number; username: string; email: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  /**
   * 记录登录
   * @param userId 用户ID
   * @param ip 登录IP
   */
  async recordLogin(userId: number, ip: string) {
    // 更新用户最后登录IP
    await this.userRepository.updateLastLoginIp(userId, ip);

    // 记录登录历史
    await this.userRepository.createLoginHistory(userId, ip);
  }
}
