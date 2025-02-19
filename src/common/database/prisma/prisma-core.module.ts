import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { PrismaClient as PrismaMysqlClient } from 'prisma-mysql';
import { PrismaClient as PrismaPostgresqlCLient } from 'prisma-postgresql';
import { catchError, defer, lastValueFrom } from 'rxjs';
import {
  PrismaModuleAsyncOptions,
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './prisma-options.interface';
import {
  PRISMA_CONNECTIONS,
  PRISMA_MODULE_OPTIONS,
  PRISMACLIENT,
} from './prisma.constants';
import { getDBTYpe, handleRetry } from './prisma.utils';
import { PrismaCommonModule } from './prisma-common.module';

@Global()
@Module({
  imports: [PrismaCommonModule]
})
export class PrismaCoreModule implements OnApplicationShutdown {
  static connections: Record<string, any> = {};
  onApplicationShutdown() {
    if (
      PrismaCoreModule.connections &&
      Object.keys(PrismaCoreModule.connections).length > 0
    ) {
      for (const connection of Object.keys(PrismaCoreModule.connections)) {
        const client = PrismaCoreModule.connections[connection];
        if (client?.$disconnect && typeof client.$disconnect === 'function') {
          client.$disconnect();
        }
      }
    }
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
        if (this.connections[url]) {
          return this.connections[url];
        }
        // 加入错误重试
        const client = await prismaConnectionErrorFactory(
          newOptions,
          providerName,
        );
        this.connections[url] = client;
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

    const connectionsProvider: Provider = {
      provide: PRISMA_CONNECTIONS,
      useValue: this.connections,
    };

    return {
      module: PrismaCoreModule,
      providers: [prismaClientProviders, connectionsProvider],
      exports: [prismaClientProviders, connectionsProvider],
    };
  }

  static forRootAsync(_options: PrismaModuleAsyncOptions): DynamicModule {
    const provideName = _options.name || PRISMACLIENT;
    const providerClientProvider: Provider = {
      provide: provideName,
      useFactory: (prismaModuleOptions: PrismaModuleOptions) => {
        // 这里的prismaModuleOptions 其实就是 createAsyncProviders创建并且注入的 PRISMA_MODULE_OPTIONS
        // 绕一大圈就是为了在这里拿到用户使用 useClass 和 useExisting 产生后的options
        const {
          url,
          options = {},
          retryAttempts = 3,
          retryDelay = 3000,
          connectionFactory,
          connectionErrorFactory,
        } = prismaModuleOptions;

        let newOptions = {
          datasourceUrl: url,
        };
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

        const prismaConnectionErrorFactory =
          connectionFactory ||
          (async (clientOptions) => await new _prismaClient(clientOptions));
        connectionErrorFactory || ((error) => error);

        // 只需要返回实例，和错误处理重试就行
        return lastValueFrom(
          defer(async () => {
            // 这里处理连接实例管理
            const url = newOptions.datasourceUrl;
            if (this.connections[url]) {
              return this.connections[url];
            }
            // 这里不需要链接，prisma在query执行的时候自己会去链接
            const client = await prismaConnectionErrorFactory(
              newOptions,
              prismaModuleOptions.connectionName || 'PrismaClient',
            );
            this.connections[url] = client;
            return client;
          }).pipe(
            // 自定义重试，这里参考nestjs/Typeorm官方重试
            handleRetry(retryAttempts, retryDelay),
            // 错误处理
            catchError((error) => {
              throw prismaConnectionErrorFactory(error);
            }),
          ),
        );
      },
      inject: [PRISMA_MODULE_OPTIONS],
    };

    // 获取自己内部创建的链接Provider 注入到forRootAsync中，让使用者可以拿到
    const asyncProviders = this.createAsyncProviders(_options);

    const connectionsProvider: Provider = {
      provide: PRISMA_CONNECTIONS,
      useValue: this.connections,
    };

    return {
      module: PrismaCoreModule,
      providers: [
        ...asyncProviders,
        providerClientProvider,
        connectionsProvider,
      ],
      exports: [providerClientProvider, connectionsProvider],
    };
  }

  /**
   * 创建异步的provider
   */
  private static createAsyncProviders(options: PrismaModuleAsyncOptions) {
    // 这里是为了解决先实例化，再注入的问题
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProviders(options)];
    }
    const useClass = options.useClass as Type<PrismaOptionsFactory>;
    return [
      this.createAsyncOptionsProviders(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  /**
   * 创建 PRISMA_MODULE_OPTIONS 的 provider 来源
   */
  private static createAsyncOptionsProviders(
    options: PrismaModuleAsyncOptions,
  ) {
    /**
     * 如果用户传入了useFactory，则使用用户定义的useFactory
     *
     * @example
     * PrismaModule.forRootAsync({
     *  useFactory: async (configService: ConfigService) => ({
     *    url: configService.get('DATABASE_URL'),
     *  }),
     *  inject: [ConfigService],
     * })
     */
    if (options.useFactory) {
      return {
        provide: PRISMA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    /**
     * 用户没有传入useFactory，则使用useClass或者useExisting
     * useExisting: 使用已有的模块
     * useClass: 使用新的模块
     *
     * @example
     * PrismaModule.forRootAsync({
     *  useFactory: async (configService: ConfigService) => ({
     *    url: configService.get('DATABASE_URL'),
     *  }),
     *  inject: [ConfigService],
     * })
     *
     *
     * PrismaModule.forRootAsync({
     *  useExisting: ConfigService,
     * })
     */
    const inject = [
      (options.useClass || options.useExisting) as Type<PrismaModuleOptions>,
    ];
    return {
      provide: PRISMA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PrismaOptionsFactory) =>
        await optionsFactory.createPrismaModuleOptions(),
      inject,
    };
  }
}
