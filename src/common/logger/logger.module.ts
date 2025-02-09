import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  consoleTransport,
  createDailyRotateFileTransport,
} from './createRotateTransports';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configServer: ConfigService) => {
        const IS_ON = configServer.get<boolean>('LOG_ON', false);
        return {
          transports: [
            consoleTransport,
            ...(IS_ON
              ? [
                  createDailyRotateFileTransport('info', 'application'),
                  createDailyRotateFileTransport('warn', 'error'),
                ]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LoggerModule {}
