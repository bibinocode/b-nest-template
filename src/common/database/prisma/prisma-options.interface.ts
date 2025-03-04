import { ModuleMetadata, Type } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface PrismaModuleOptions {
  /**
   * 数据库连接URL
   */
  url?: string;
  /**
   * 链接配置
   */
  options?: Prisma.PrismaClientOptions;
  /**
   * 链接注入别名
   */
  connectionName?: string;
  /**
   * 重试次数
   */
  retryAttempts?: number;
  /**
   * 重试延迟
   */
  retryDelay?: number;
  /**
   * 用户自定义链接工厂
   */
  connectionFactory?: Function;
  /**
   * 用户自定义链接错误工厂
   */
  connectionErrorFactory?: Function;
}

export interface PrismaOptionsFactory {
  createPrismaModuleOptions():
    | Promise<PrismaModuleOptions>
    | PrismaModuleOptions;
}

export interface PrismaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<PrismaOptionsFactory>;
  useClass?: Type<PrismaOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PrismaModuleOptions> | PrismaModuleOptions;
  inject?: any[];
}
