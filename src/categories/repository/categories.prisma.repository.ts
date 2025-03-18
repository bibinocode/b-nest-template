import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoriesAbstractRepository } from './categories.abstract.repository';
import { PRISMA_DATABASE } from 'src/common/database/database.constants';
import { PrismaClient } from 'prisma-mysql';

@Injectable()
export class CategoriesPrismaRepository extends CategoriesAbstractRepository {
  constructor(@Inject(PRISMA_DATABASE) private prisma: PrismaClient) {
    super();
  }

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        section: true,
        parent: true,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        section: true,
        parent: true,
      },
      orderBy: {
        sort_order: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        section: true,
        parent: true,
        children: true,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        section: true,
        parent: true,
      },
    });
  }

  delete(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async findTree() {
    const categories = await this.prisma.category.findMany({
      include: {
        section: true,
        children: true,
      },
      orderBy: {
        sort_order: 'asc',
      },
    });

    return this.buildTree(categories);
  }

  private buildTree(categories: any[], parentId: number | null = null): any[] {
    return categories
      .filter((category) => category.parent_id === parentId)
      .map((category) => ({
        ...category,
        children: this.buildTree(categories, category.id),
      }));
  }

  async findSectionById(id: number) {
    return this.prisma.section.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return this.prisma.category.findFirst({
      where: { name },
    });
  }

  async hasChildren(id: number) {
    const children = await this.prisma.category.findMany({
      where: { parent_id: id },
    });
    return children.length > 0;
  }
}
