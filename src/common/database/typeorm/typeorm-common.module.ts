import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TYPEORM_DATABASE } from '../database.constants';
import { TypeormConfigService } from './typeorm-config.service';
import { TYPEORM_CONNECTIONS } from './typeorm.constants';
import { TypeormProvider } from './typeorm.provider';

const connections = new Map<string, DataSource>();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: TYPEORM_DATABASE,
      useClass: TypeormConfigService,
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
    TypeOrmModule.forFeature([User], TYPEORM_DATABASE),
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
