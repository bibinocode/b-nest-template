import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/user.entity';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  onModuleInit() {
    throw new Error('Method not implemented.');
  }

  @Get()
  async getUser() {
    const res = (await this.userRepository).find();
    return res;
  }
}
