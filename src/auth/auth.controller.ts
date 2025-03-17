import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.signin(loginDto.username, loginDto.password);
  }

  @ApiOperation({ summary: '获取当前用户资料' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    // JWT 验证后，req.user 包含了解析的 token 信息
    return this.authService.getProfile((req.user as any).userId);
  }
}
