import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Request } from 'express';

export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(REQUEST) private request: Request,
    private configService: ConfigService,
  ) {}
  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    const headers = this.request.headers;
    const tenantId = headers['x-tenant-id'];
    let config: any = {
      port: 3306,
    };
    const envConfig = {
      type: this.configService.get<string>('DB_TYPE'),
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      synchronize: Boolean(
        this.configService.get<boolean>('DB_SYNCHRONIZE', false),
      ),
      autoLoadEntities: Boolean(
        this.configService.get<boolean>('DB_AUTO_LOAD_ENTITIES', false),
      ),
      tenantId, // 这里可以把tenantId传出去，然后 dataSourceFactory 回调中可以拿到
    };

    if (tenantId === 'mysql1') {
      config = {
        port: 3307,
      };
    } else if (tenantId === 'postgresql') {
      config = {
        type: 'postgres',
        port: 5432,
        username: 'postgres',
        database: 'testdb',
      };
    }

    const finalConfig = Object.assign(envConfig, config);
    return finalConfig;
  }
}
