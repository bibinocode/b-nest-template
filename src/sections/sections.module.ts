import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { SectionsPrismaRepository } from './repository/sections.prisma.repository';
import { SectionsRepository } from './sections.repository';

@Module({
  imports: [],
  controllers: [SectionsController],
  providers: [SectionsService, SectionsPrismaRepository, SectionsRepository],
  exports: [SectionsService, SectionsPrismaRepository, SectionsRepository],
})
export class SectionsModule {}
