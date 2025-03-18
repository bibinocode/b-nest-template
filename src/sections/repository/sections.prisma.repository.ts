import { PRISMA_DATABASE } from 'src/common/database/database.constants';
import { CreateSectionDto } from '../dto/create-section.dto';
import { SectionsAbstractRepository } from './sections.abstract.repository';
import { PrismaClient } from 'prisma-mysql';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateSectionDto } from '../dto/update-section.dto';

@Injectable()
export class SectionsPrismaRepository implements SectionsAbstractRepository {
  constructor(@Inject(PRISMA_DATABASE) private prisma: PrismaClient) {}

  async create(createSectionsDto: CreateSectionDto): Promise<any> {
    return this.prisma.section.create({
      data: createSectionsDto,
      include: {
        categories: true,
      },
    });
  }

  async findAll(): Promise<any> {
    return this.prisma.section.findMany({
      include: {
        categories: true,
      },
      orderBy: [{ is_featured: 'desc' }, { sort_order: 'asc' }],
    });
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.section.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });
  }

  async update(id: number, updateSectionDto: UpdateSectionDto): Promise<any> {
    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
      include: {
        categories: true,
      },
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.section.delete({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<any> {
    return this.prisma.section.findFirst({
      where: { slug },
    });
  }

  async findByName(name: string): Promise<any> {
    return this.prisma.section.findFirst({
      where: { name },
    });
  }
}
