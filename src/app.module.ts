import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from './common/config/config.module';
import { TypeormConfigService } from './common/database/typeorm/typeorm-config.service';
import { LoggerModule } from './common/logger/logger.module';
import { MailerModule } from './common/mailer/mailer.module';
import { User } from './user/user.entity';

const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 ~ file: app.module.ts:13 ~ isDev:', isDev);

// 存储多租户数据源，防止内存泄漏
const connections = new Map<string, DataSource>();
@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MailerModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      dataSourceFactory: async (
        options: DataSourceOptions & { tenantId: string },
      ) => {
        const tenantId = options?.tenantId ?? 'default';
        // 如果tenantId存在，则从connections中获取
        if (tenantId && connections.has(tenantId)) {
          return connections.get(tenantId);
        }
        const dataSource = new DataSource(options);
        connections.set(tenantId, dataSource);
        return dataSource;
      },
    }),
    TypeOrmModule.forFeature([User]), // 加载实体
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TYPEORM_CONNECTIONS',
      useValue: connections,
    },
  ],
})
export class AppModule {}
