import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/database/prisma/prisma-config.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUsername = await this.prisma.users.findUnique({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('邮箱已存在');
    }

    // 使用 argon2 加密密码
    const hashedPassword = await argon2.hash(createUserDto.password);

    // 创建用户
    const user = await this.prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        nickname: true,
        username: true,
        email: true,
        avatar: true,
        sex: true,
        signature: true,
        created_at: true,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        nickname: true,
        username: true,
        email: true,
        avatar: true,
        sex: true,
        signature: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        username: true,
        email: true,
        avatar: true,
        sex: true,
        signature: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async findByUsername(username: string) {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 检查用户是否存在
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 更新用户信息
    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        nickname: true,
        username: true,
        email: true,
        avatar: true,
        sex: true,
        signature: true,
        updated_at: true,
      },
    });
  }

  async remove(id: number) {
    // 检查用户是否存在
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 删除用户
    await this.prisma.users.delete({
      where: { id },
    });

    return { message: '用户删除成功' };
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    // 查找用户
    const user = await this.prisma.users.findUnique({
      where: { username },
    });

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

  async recordLogin(userId: number, ip: string) {
    // 更新用户最后登录IP
    await this.prisma.users.update({
      where: { id: userId },
      data: { last_login_ip: ip },
    });

    // 记录登录历史
    await this.prisma.userLoginHistory.create({
      data: {
        ip,
        b_users_id: userId,
      },
    });
  }
}
