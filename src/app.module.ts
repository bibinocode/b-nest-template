import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from './common/config/config.module';
import { LoggerModule } from './common/logger/logger.module';
import { MailerModule } from './common/mailer/mailer.module';

const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 ~ file: app.module.ts:13 ~ isDev:', isDev);

@Module({
  imports: [ConfigModule, LoggerModule, RedisModule.forRootAsync({
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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configServer: ConfigService) => {
        return {
          type: configServer.get<string>('DB_TYPE'),
          host: configServer.get<string>('DB_HOST'),
          port: configServer.get<number>('DB_PORT'),
          username: configServer.get<string>('DB_USERNAME'),
          password: configServer.get<string>('DB_PASSWORD'),
          database: configServer.get<string>('DB_DATABASE'),
          autoLoadEntities: Boolean(configServer.get<boolean>('DB_AUTO_LOAD_ENTITIES', false)), // 自动加载实体
          synchronize: Boolean(configServer.get<boolean>('DB_SYNCHRONIZE', false)), // 同步实体
        } as TypeOrmModuleOptions
      }
    }),
    TypeOrmModule.forFeature([]) // 加载实体
],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
