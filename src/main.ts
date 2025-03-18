import {
  VERSION_NEUTRAL,
  VersioningType,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const Config = app.get(ConfigService);

  /**
   * 全局管道验证
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 去除在验证类中不存在的属性
      transform: true, // 自动转换类型
      forbidNonWhitelisted: true, // 禁止在验证类中不存在的属性
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式转换
      },
    }),
  );

  /**
   * WebSocket 网关适配
   */
  app.useWebSocketAdapter(new WsAdapter(app));

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
  const apiVersion = Config.get<string>('API_VERSION');
  // 根据 API_VERSION 是否存在决定使用 VERSION_NEUTRAL 还是版本数组
  const versions = apiVersion
    ? apiVersion.includes(',')
      ? apiVersion.split(',')
      : [apiVersion]
    : VERSION_NEUTRAL;

  console.log('🚀 versions', versions);

  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: versions,
  });

  /**
   * 生成 Swagger 文档
   * 确保在设置前缀和版本化后,不然不会自动识别到版本
   */
  generateDocument(app);

  /**
   * 开启生命周期
   */
  app.enableShutdownHooks();

  /**
   * PORT配置
   */
  const PORT = Config.get<number>('PORT', 3000);
  console.log('🚀 listen on port', PORT);
  await app.listen(PORT);
}
bootstrap();
