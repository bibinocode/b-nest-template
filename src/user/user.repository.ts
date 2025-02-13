import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User, 'mysql1') private userRepository1: Repository<User>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getRepository() {
    const headers = this.request.headers;
    const teantId = headers['x-tenant-id'];
    if (teantId === 'mysql1') {
      return this.userRepository1;
    }
    return this.userRepository;
  }
}
