import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './prisma-options.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, PrismaOptionsFactory {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}
  onModuleInit() {
    throw new Error('Method not implemented.');
  }
  createPrismaModuleOptions():
    | Promise<PrismaModuleOptions>
    | PrismaModuleOptions {
    // const headers = this.request.headers;
    // const tenantId = headers['x-tenant-id'] || 'default';

    // if (tenantId === 'default') {
    //   return {
    //     url: 'mysql://root:JHYnGfzMfmXS7Y6X@localhost:3306/b-nest-server',
    //   };
    // } else if (tenantId === 'postgresql')
    //   return {
    //     url: 'postgresql://admin:admin123456@localhost:5432/b-nest-server',
    //   };
    return {
      url: this.configService.get('DATABASE_URL'), // 我是单库
    };
  }
}
