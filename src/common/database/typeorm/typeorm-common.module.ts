import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_DATABASE } from '../database.constants';
import { TypeormConfigService } from './typeorm-config.service';
import { TYPEORM_CONNECTIONS } from './typeorm.constants';
import { TypeormProvider } from './typeorm.provider';
import { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

const connections = new Map<string, DataSource>();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: TYPEORM_DATABASE,
      useClass: TypeormConfigService,
      // @ts-ignore
      dataSourceFactory: async (
        options: DataSourceOptions & { tenantId: string },
      ) => {
        const tenantId = options?.tenantId ?? 'default';
        if (tenantId && connections.has(tenantId)) {
          return connections.get(tenantId);
        }
        const dataSource = await new DataSource(options).initialize();
        connections.set(tenantId, dataSource);
        return dataSource;
      },
      inject: [],
      extraProviders: [],
    }),
    // TypeOrmModule.forFeature([], TYPEORM_DATABASE), // 在使用的模块导入
  ],
  providers: [
    TypeormProvider,
    {
      provide: TYPEORM_CONNECTIONS,
      useValue: connections,
    },
  ],
})
export class TypeormCommonModule {}
