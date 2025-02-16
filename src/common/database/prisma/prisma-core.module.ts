import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { PrismaClient as PrismaMysqlClient } from 'prisma-mysql';
import { PrismaClient as PrismaPostgresqlCLient } from 'prisma-postgresql';
import { PrismaModuleOptions } from './prisma-options.interface';
import { PRISMACLIENT } from './prisma.constants';
import { getDBTYpe } from './prisma.utils';

@Global()
@Module({})
export class PrismaCoreModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    throw new Error('Method not implemented.');
  }
  static forRoot(options: PrismaModuleOptions): DynamicModule {
    // 实现client连接
    const prismaClientProviders: Provider = {
      provide: PRISMACLIENT,
      useFactory() {
        const url = options.url;
        const dbType = getDBTYpe(url);
        const _options = {
          datasourceUrl: options.url,
          ...options.options,
        };
        if (dbType === 'mysql') {
          return new PrismaMysqlClient(_options);
        } else if (dbType === 'postgresql') {
          return new PrismaPostgresqlCLient(_options);
        } else {
          throw new Error(`不支持的链接数据库类型 ${dbType}`);
        }
      },
    };

    return {
      module: PrismaCoreModule,
      providers: [prismaClientProviders],
      exports: [prismaClientProviders],
    };
  }

  static forRootAsync() {}
}
