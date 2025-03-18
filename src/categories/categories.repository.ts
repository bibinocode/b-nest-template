import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesAbstractRepository } from './repository/categories.abstract.repository';
import { CategoriesPrismaRepository } from './repository/categories.prisma.repository';

@Injectable()
export class CategoriesRepository implements CategoriesAbstractRepository {
  constructor(private categoriesPrismaRepository: CategoriesPrismaRepository) {}

  protected getRepository() {
    return this.categoriesPrismaRepository;
  }

  create(createCategoryDto: CreateCategoryDto) {
    const client = this.getRepository();
    return client.create(createCategoryDto);
  }

  findAll() {
    const client = this.getRepository();
    return client.findAll();
  }

  findOne(id: number) {
    const client = this.getRepository();
    return client.findOne(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const client = this.getRepository();
    return client.update(id, updateCategoryDto);
  }

  delete(id: number) {
    const client = this.getRepository();
    return client.delete(id);
  }

  findTree() {
    const client = this.getRepository();
    return client.findTree();
  }

  findSectionById(id: number) {
    const client = this.getRepository();
    return client.findSectionById(id);
  }

  findByName(name: string) {
    const client = this.getRepository();
    return client.findByName(name);
  }

  hasChildren(id: number) {
    const client = this.getRepository();
    return client.hasChildren(id);
  }
}
