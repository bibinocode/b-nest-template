import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationShutdown {
  constructor(
    @Inject('TYPEORM_CONNECTIONS')
    private readonly connections: Map<string, DataSource>,
  ) {}
  async onApplicationShutdown() {
    if (this.connections.size > 0) {
      for (const connection of this.connections.keys()) {
        this.connections.get(connection)?.destroy();
      }
    }
  }
}
