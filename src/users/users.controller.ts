import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('用户')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    const user = await this.usersService.validateUser(loginUserDto);

    // 记录登录信息
    const ip = req.ip || '未知IP';
    await this.usersService.recordLogin(user.id, ip);

    // 这里应该返回JWT令牌，但需要与Auth模块集成
    // 暂时返回用户信息
    return {
      message: '登录成功',
      user,
    };
  }

  @ApiOperation({ summary: '获取所有用户' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: '获取指定用户' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: '获取当前用户资料' })
  @Get('profile')
  getProfile(@Req() req: Request) {
    // 注意：这里需要在请求中添加用户信息，通常通过JWT中间件实现
    // 暂时使用any类型，后续需要与Auth模块集成后修改
    const user = (req as any).user;
    if (!user) {
      throw new BadRequestException('未找到用户信息');
    }
    return this.usersService.findOne(user.id);
  }
}
