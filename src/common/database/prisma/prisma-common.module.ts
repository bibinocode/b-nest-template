import { Module } from '@nestjs/common';
import { PRISMA_DATABASE } from '../database.constants';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      name: PRISMA_DATABASE,
      useClass: PrismaService,
    }),
  ],
})
export class PrismaCommonModule {}
