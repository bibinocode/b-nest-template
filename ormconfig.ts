import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DataSource, DataSourceOptions } from 'typeorm';

export function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}

export function buildDataSourceOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV} || 'development'`);
  const config = {
    ...defaultConfig,
    ...envConfig,
  };

  return {
    type: config['DB_TYPE'],
    host: config['DB_HOST'],
    port: config['DB_PORT'],
    username: config['DB_USERNAME'],
    password: config['DB_PASSWORD'],
    database: config['DB_DATABASE'],
    entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
    synchronize: config['DB_SYNCHRONIZE'],
    autoLoadEntities: config['DB_AUTO_LOAD_ENTITIES'],
  } as TypeOrmModuleOptions;
}

export default new DataSource({
  ...buildDataSourceOptions(),
} as DataSourceOptions);
