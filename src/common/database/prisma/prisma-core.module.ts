import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { PrismaClient as PrismaMysqlClient } from 'prisma-mysql';
import { PrismaClient as PrismaPostgresqlCLient } from 'prisma-postgresql';
import { catchError, defer, lastValueFrom } from 'rxjs';
import { PrismaModuleOptions } from './prisma-options.interface';
import { PRISMACLIENT } from './prisma.constants';
import { getDBTYpe, handleRetry } from './prisma.utils';

@Global()
@Module({})
export class PrismaCoreModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    throw new Error('Method not implemented.');
  }
  static forRoot(_options: PrismaModuleOptions): DynamicModule {
    const {
      url,
      options = {},
      connectionName,
      retryAttempts = 3,
      retryDelay = 3000,
      connectionFactory,
      connectionErrorFactory,
    } = _options;
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

    const dbType = getDBTYpe(url);
    let _prismaClient;
    if (dbType === 'mysql') {
      _prismaClient = PrismaMysqlClient;
    } else if (dbType === 'postgresql') {
      _prismaClient = PrismaPostgresqlCLient;
    } else {
      throw new Error(`不支持的链接数据库类型 ${dbType}`);
    }

    /**
     * 这里为了实现多数据库链接，注入识别不同的实例
     * PrismaModule.forRoot('mysql://root:123455@localhost:3306/test','mysql1')
     * PrismaModule.forRoot('postgresql://root:123455@localhost:5432/test','postgresql1')
     */
    const providerName = connectionName || PRISMACLIENT;
    const prismaConnectionErrorFactory =
      connectionFactory ||
      (async (clientOptions) => await new _prismaClient(clientOptions));
    connectionErrorFactory || ((error) => error);
    // 实现client连接
    const prismaClientProviders: Provider = {
      provide: providerName,
      useFactory: async () => {
        // 加入错误重试
        const client = await prismaConnectionErrorFactory(
          newOptions,
          providerName,
        );

        // 获取最后一次的值
        return lastValueFrom(
          // 延迟执行
          defer(() => client.$connect()).pipe(
            // 自定义重试，这里参考nestjs/Typeorm官方重试
            handleRetry(retryAttempts, retryDelay),
            // 错误处理
            catchError((error) => {
              throw prismaConnectionErrorFactory(error);
            }),
          ),
        ).then(() => client);
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
