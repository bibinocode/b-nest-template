import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UsersPrismaRepository } from './repository/users.prisma.repository';
import { UserAbstractRepository } from './repository/users.abstract.repository';
import { Users } from 'prisma/clients/mysql';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository implements UserAbstractRepository {
  constructor(
    @Inject(REQUEST) private request: Request,
    private usersPrismaRepository: UsersPrismaRepository,
  ) {}
  getRepository() {
    // 这里根据就后续请求来返回不同的 repository 我这里就固定了
    return this.usersPrismaRepository;
  }
  create(createUserDto: CreateUserDto): Promise<Partial<Users>> {
    const client = this.getRepository();
    return client.create(createUserDto);
  }
  findOne(id: number): Promise<Partial<Users> | null> {
    const client = this.getRepository();
    return client.findOne(id);
  }
  findAll(): Promise<Partial<Users>[]> {
    const client = this.getRepository();
    return client.findAll();
  }
  findByUsername(username: string): Promise<Users | null> {
    const client = this.getRepository();
    return client.findByUsername(username);
  }
  findByEmail(email: string): Promise<Users | null> {
    const client = this.getRepository();
    return client.findByEmail(email);
  }
  update(id: number, updateUserDto: UpdateUserDto): Promise<Partial<Users>> {
    const client = this.getRepository();
    return client.update(id, updateUserDto);
  }
  remove(id: number): Promise<void> {
    const client = this.getRepository();
    return client.remove(id);
  }
  updateLastLoginIp(userId: number, ip: string): Promise<void> {
    const client = this.getRepository();
    return client.updateLastLoginIp(userId, ip);
  }
  createLoginHistory(userId: number, ip: string): Promise<void> {
    const client = this.getRepository();
    return client.createLoginHistory(userId, ip);
  }
}
