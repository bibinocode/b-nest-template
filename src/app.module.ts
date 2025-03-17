import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AxiosModule } from './common/axios/axios.module';
import { ConfigModule } from './common/config/config.module';
import { DatabaseModule } from './common/database/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { MailerModule } from './common/mailer/mailer.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';

const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 ~ file: app.module.ts:13 ~ isDev:', isDev);

// 存储多租户数据源，防止内存泄漏

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MailerModule,
    DatabaseModule,
    AxiosModule,
    EventsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
