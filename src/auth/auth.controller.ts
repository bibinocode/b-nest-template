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
import { UsersService } from 'src/users/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { UsersInterface } from 'src/users/interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({
    status: 200,
    description: '用户注册成功',
    type: UsersInterface,
  })
  @Post('register')
  @Public()
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UsersInterface> {
    const user = await this.usersService.create(createUserDto);
    return new UsersInterface({ ...(user as UsersInterface) });
  }

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    const user = await this.usersService.validateUser(loginUserDto);

    // 记录登录信息
    const ip = req.ip || '未知IP';
    await this.usersService.recordLogin(user.id, ip);
    const access_token = await this.authService.signin({
      nickname: user.nickname,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      sex: user.sex,
      signature: user.signature,
      id: user.id,
      last_login_ip: ip,
    });

    return {
      message: '登录成功',
      access_token,
    };
  }
}
