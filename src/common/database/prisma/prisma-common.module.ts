import { Module, forwardRef } from '@nestjs/common';
import { PRISMA_DATABASE } from '../database.constants';
import { PrismaModule } from './prisma.module';
import { PrismaConfigService } from './prisma-config.service';

@Module({
  imports: [
    forwardRef(() =>
      PrismaModule.forRootAsync({
        name: PRISMA_DATABASE,
        useClass: PrismaConfigService,
      }),
    ),
  ],
})
export class PrismaCommonModule {}
