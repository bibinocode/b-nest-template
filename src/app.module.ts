import { Module } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonUtils } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import * as Joi from 'joi';
import * as winston from 'winston';

import { ConfigModule } from '@nestjs/config';
import * as DailyRotateFile from 'winston-daily-rotate-file';

/**
 * 配置模块
 */
const envFilePath = [`.env.${process.env.NODE_ENV || 'development'}`, '.env'];

const isDev = process.env.NODE_ENV === 'development';

console.log('🚀 ~ file: app.module.ts:13 ~ isDev:', isDev);

function createDailyRotateFileTransport(level: string, fileName: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${fileName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH', // 日期格式
    zippedArchive: true, // 归档压缩
    maxFiles: '14d', // 最大保存14天
    maxSize: '20m', // 最大大小
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(), // 简单格式
    ),
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局使用
      envFilePath,
      validationSchema: Joi.object({}), // 验证规则
    }),
    PrismaModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonUtils.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        ...(isDev
          ? []
          : [
              createDailyRotateFileTransport('info', 'app'),
              createDailyRotateFileTransport('warn', 'app-warn'),
              createDailyRotateFileTransport('error', 'app-error'),
            ]),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
