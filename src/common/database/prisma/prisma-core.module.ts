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
  static forRoot(_options: PrismaModuleOptions): DynamicModule {
    const { url, options = {}, connectionName } = _options;
    let newOptions = {
      datasourceUrl: url,
    };
    // 如果options为空，则将options赋值给newOptions
    if (!Object.keys(options).length) {
      newOptions = {
        ...newOptions,
        ...options,
      };
    }
    /**
     * 这里为了实现多数据库链接，注入识别不同的实例
     * PrismaModule.forRoot('mysql://root:123455@localhost:3306/test','mysql1')
     * PrismaModule.forRoot('postgresql://root:123455@localhost:5432/test','postgresql1')
     */
    const providerName = connectionName || PRISMACLIENT;
    // 实现client连接
    const prismaClientProviders: Provider = {
      provide: providerName,
      useFactory() {
        const dbType = getDBTYpe(url);
        if (dbType === 'mysql') {
          return new PrismaMysqlClient(newOptions);
        } else if (dbType === 'postgresql') {
          return new PrismaPostgresqlCLient(newOptions);
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
