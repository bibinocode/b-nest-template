import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseService implements MongooseOptionsFactory {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    const headers = this.request.headers;
    const tenantId = headers['x-tenant-id'] || 'default';

    let uri;
    const defaultUri = 'mongodb://localhost:27017/nest';
    if (tenantId === 'default') {
      uri = defaultUri;
    } else {
      uri = `mongodb://localhost:27017/nest-${tenantId}`;
    }
    return {
      uri,
    };
  }
}
