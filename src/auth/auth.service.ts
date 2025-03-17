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
  async signin(payload: Record<string, any>) {
    return this.jwtService.sign(payload);
  }
}
