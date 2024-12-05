import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): Promise<User> {
    return this.prisma.user.findFirst();
  }
}
