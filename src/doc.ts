import {
  SwaggerCustomOptions,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import * as packageJson from '../package.json';
import { INestApplication } from '@nestjs/common';

export const generateDocument = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: '请输入JWT token',
        in: 'header',
      },
      'bearer',
    ) // 这个是安全方案的名称，可以在控制器或方法装饰器中引用 @ApiBearerAuth('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/doc', app, document);
};
