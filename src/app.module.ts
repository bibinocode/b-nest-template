import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './common/config/config.module';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { MailerModule } from './common/mailer/mailer.module';

const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 ~ file: app.module.ts:13 ~ isDev:', isDev);

@Module({
  imports: [ConfigModule, LoggerModule, PrismaModule, RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        type: "single", // 单例模式
        url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
        options: {
          password: configService.get<string>('REDIS_PASSWORD'),
        }
      };
    },
  }), MailerModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
