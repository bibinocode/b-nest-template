import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './common/config/config.module';
import { LoggerModule } from './common/logger/logger.module';

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
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
