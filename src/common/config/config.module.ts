import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import { baseConfigValidation, envFilePath } from './env.validation';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: baseConfigValidation,
    }),
  ],
})
export class ConfigModule {}
