import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 检查用户是否存在
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 更新用户信息
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    // 检查用户是否存在
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 删除用户
    await this.userRepository.remove(id);

    return { message: '用户删除成功' };
  }
}
