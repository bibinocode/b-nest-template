import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user/user.entity';
import { UserRepository } from './user/user.repository';

@Controller()
export class AppController implements OnModuleInit {
  private readonly userRepository: Promise<Repository<User>>;

  constructor(private repository: UserRepository) {
    this.userRepository = this.repository.getRepository();
  }
  onModuleInit() {
    throw new Error('Method not implemented.');
  }

  @Get()
  async getUser() {
    const res = (await this.userRepository).find();
    return res;
  }
}
