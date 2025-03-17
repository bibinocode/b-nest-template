import { utilities } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Console } from 'winston/lib/winston/transports';

export const consoleTransport = new Console({
  level: 'silly',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    utilities.format.nestLike('b_nest_template', {
      colors: true,
      prettyPrint: true,
      processId: true,
      appName: true,
    }),
  ),
});

export function createDailyRotateFileTransport(
  level: string,
  fileName: string,
) {
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
