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
   * PORT配置
   */
  const PORT = Config.get<number>('PORT', 3000);
  await app.listen(PORT);
}
bootstrap();
