import { Inject, Injectable } from '@nestjs/common';
import { UserAbstractRepository } from './users.abstract.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from 'prisma-mysql';
import { PRISMACLIENT } from 'src/common/database/prisma/prisma.constants';
import { PRISMA_DATABASE } from 'src/common/database/database.constants';

@Injectable()
export class UsersPrismaRepository implements UserAbstractRepository {
  constructor(@Inject(PRISMA_DATABASE) private prisma: any) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<Users>> {
    return this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findOne(id: number): Promise<Partial<Users> | null> {
    return this.prisma.users.findUnique({
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
  }

  async findAll(): Promise<Partial<Users>[]> {
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

  async findByUsername(username: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<Users>> {
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

  async remove(id: number): Promise<void> {
    await this.prisma.users.delete({
      where: { id },
    });
  }

  async updateLastLoginIp(userId: number, ip: string): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { last_login_ip: ip },
    });
  }

  async createLoginHistory(userId: number, ip: string): Promise<void> {
    await this.prisma.userLoginHistory.create({
      data: {
        ip,
        b_users_id: userId,
      },
    });
  }
}
