import { DynamicModule, Module } from '@nestjs/common';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
  MongooseModule as NestMongooseModule,
} from '@nestjs/mongoose';
import { MongooseCoreModule } from './mongoose-core.module';

@Module({})
export class MongooseModule extends NestMongooseModule {
  static forRoot(
    uri: string,
    options: MongooseModuleOptions = {},
  ): DynamicModule {
    return {
      module: MongooseModule,
      imports: [MongooseCoreModule.forRoot(uri, options)],
    };
  }

  static forRootAsync(options: MongooseModuleAsyncOptions): DynamicModule {
    return {
      module: MongooseModule,
      imports: [MongooseCoreModule.forRootAsync(options)],
    };
  }
}
