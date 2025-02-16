import { Prisma } from '@prisma/client';

export interface PrismaModuleOptions {
  url?: string;
  options?: Prisma.PrismaClientOptions;
}
