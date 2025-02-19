import { Inject, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TYPEORM_CONNECTIONS } from './typeorm.constants';

export class TypeormProvider implements OnApplicationShutdown {
  constructor(
    @Inject(TYPEORM_CONNECTIONS) private connections: Map<string, DataSource>,
  ) {}
  onApplicationShutdown(signal?: string) {
    if (this.connections.size > 0) {
      for (const key of this.connections.keys()) {
        this.connections.get(key).destroy();
      }
    }
  }
}
