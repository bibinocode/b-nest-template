import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from './common/config/config.module';
import { DatabaseModule } from './common/database/database.module';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { MailerModule } from './common/mailer/mailer.module';

const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 ~ file: app.module.ts:13 ~ isDev:', isDev);

// 存储多租户数据源，防止内存泄漏

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MailerModule,
    PrismaModule.forRoot(
      'mysql://root:DzeyJhtbx7mTE6AC@kmod.cn:3306/b-nest-server',
    ),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
