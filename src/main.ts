import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const Config = app.get(ConfigService);

  /**
   * 设置全局Logger
   */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  /**
   * 全局异常过滤器
   */
  const isGlobalErrorFilterOn = Config.get<boolean>(
    'GLOBAL_ERROR_FILTER_ON',
    true,
  );
  if (isGlobalErrorFilterOn) {
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
  }

  /**
   * API跨域请求配置
   */
  const corsOn = Config.get<boolean>('API_CORS_ON', false);
  if (corsOn) {
    app.enableCors();
  }

  /**
   * API配置
   */
  const apiPrefix = Config.get<string>('API_PREFIX', '/api');
  const apiVersion = Config.get<string>('API_VERSION', '1');
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [apiVersion],
  });

  /**
   * PORT配置
   */
  const PORT = Config.get<number>('PORT', 3000);
  await app.listen(PORT);
}
bootstrap();
