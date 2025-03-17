import {
  SwaggerCustomOptions,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import * as packageJson from '../../package.json';
import { INestApplication } from '@nestjs/common';

export const generateDocument = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/doc', app, document);
};
