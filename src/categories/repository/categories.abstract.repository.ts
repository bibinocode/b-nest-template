import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export abstract class CategoriesAbstractRepository {
  abstract create(createCategoryDto: CreateCategoryDto): Promise<any>;
  abstract findAll(): Promise<any>;
  abstract findOne(id: number): Promise<any>;
  abstract update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<any>;
  abstract delete(id: number): Promise<any>;
  abstract findTree(): Promise<any>;
  abstract findSectionById(id: number): Promise<any>;
  abstract findByName(name: string): Promise<any>;
  abstract hasChildren(id: number): Promise<boolean>;
}
