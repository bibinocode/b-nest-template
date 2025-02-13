import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from './common/config/config.module';
import { LoggerModule } from './common/logger/logger.module';
import { MailerModule } from './common/mailer/mailer.module';
import { User } from './user/user.entity';
import { UserRepository } from './user/user.repository';

const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 ~ file: app.module.ts:13 ~ isDev:', isDev);

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    // RedisModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       type: 'single', // 单例模式
    //       url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
    //       options: {
    //         password: configService.get<string>('REDIS_PASSWORD'),
    //       },
    //     };
    //   },
    // }),
    MailerModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configServer: ConfigService) => {
        return {
          type: configServer.get<string>('DB_TYPE'),
          host: configServer.get<string>('DB_HOST'),
          port: '3306',
          username: configServer.get<string>('DB_USERNAME'),
          password: configServer.get<string>('DB_PASSWORD'),
          database: configServer.get<string>('DB_DATABASE'),
          autoLoadEntities: Boolean(
            configServer.get<boolean>('DB_AUTO_LOAD_ENTITIES', false),
          ), // 自动加载实体
          synchronize: Boolean(
            configServer.get<boolean>('DB_SYNCHRONIZE', false),
          ), // 同步实体
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'mysql1',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get<string>('DB_TYPE'),
          host: configService.get<string>('DB_HOST'),
          port: '3307',
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: Boolean(
            configService.get<boolean>('DB_AUTO_LOAD_ENTITIES', false),
          ), // 自动加载实体
          synchronize: Boolean(
            configService.get<boolean>('DB_SYNCHRONIZE', false),
          ), // 同步实体
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([User]), // 加载实体
    TypeOrmModule.forFeature([User], 'mysql1'),
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository],
})
export class AppModule {}
