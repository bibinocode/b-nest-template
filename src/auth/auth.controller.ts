import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { UserProfileVO } from 'src/users/interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as RequestIp from 'request-ip';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({
    status: 200,
    description: '用户注册成功',
    type: UserProfileVO,
  })
  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<UserProfileVO> {
    const user = await this.authService.create(createUserDto);
    return new UserProfileVO({ ...(user as UserProfileVO) });
  }

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    const user = await this.authService.validateUser(loginUserDto);

    // 记录登录信息
    const ip = RequestIp.getClientIp(req) || '未知IP';
    await this.authService.recordLogin(user.id, ip);

    const access_token = await this.authService.signin({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      message: '登录成功',
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        sex: user.sex,
        signature: user.signature,
      },
    };
  }
}
