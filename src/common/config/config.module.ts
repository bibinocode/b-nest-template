import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  LOG_ON: Joi.boolean().default(true),
});

const envFilePath = [`.env.${process.env.NODE_ENV || 'development'}`, '.env'];
@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
