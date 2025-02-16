import { DynamicModule, Module } from '@nestjs/common';
import { PrismaCoreModule } from './prisma-core.module';
import { PrismaModuleOptions } from './prisma-options.interface';

@Module({})
export class PrismaModule {
  static forRoot(options: PrismaModuleOptions): DynamicModule;
  static forRoot(url: string): DynamicModule;
  static forRoot(arg: any): DynamicModule {
    let _options: any;
    if (typeof arg === 'string') {
      _options = {
        url: arg,
      };
    } else {
      _options = arg;
    }

    return {
      module: PrismaModule,
      imports: [PrismaCoreModule.forRoot(_options)], // 使用核心模块逻辑
    };
  }

  static forRootAsync() {}
}
