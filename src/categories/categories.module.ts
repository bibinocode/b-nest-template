import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesPrismaRepository } from './repository/categories.prisma.repository';
import { SectionsService } from 'src/sections/sections.service';
import { SectionsPrismaRepository } from 'src/sections/repository/sections.prisma.repository';
import { SectionsRepository } from 'src/sections/sections.repository';

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesPrismaRepository,
    CategoriesRepository,
  ],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
