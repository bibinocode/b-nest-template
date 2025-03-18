import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // 检查父分类是否存在
      if (createCategoryDto.parent_id) {
        const parentCategory = await this.categoryRepository.findOne(
          createCategoryDto.parent_id,
        );
        if (!parentCategory) {
          throw new NotFoundException('父分类不存在');
        }
      }

      // 检查板块是否存在
      const section = await this.categoryRepository.findSectionById(
        createCategoryDto.b_section_id,
      );
      if (!section) {
        throw new NotFoundException('所属板块不存在');
      }

      // 检查分类名称是否已存在
      const existingCategory = await this.categoryRepository.findByName(
        createCategoryDto.name,
      );
      if (existingCategory) {
        throw new ConflictException('分类名称已存在');
      }

      return await this.categoryRepository.create(createCategoryDto);
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('创建分类失败：' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.categoryRepository.findAll();
    } catch (error: any) {
      throw new BadRequestException('获取分类列表失败：' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw new NotFoundException('分类不存在');
      }
      return category;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('获取分类详情失败：' + error.message);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      // 检查分类是否存在
      const existingCategory = await this.categoryRepository.findOne(id);
      if (!existingCategory) {
        throw new NotFoundException('分类不存在');
      }

      // 检查父分类是否存在
      if (updateCategoryDto.parent_id) {
        const parentCategory = await this.categoryRepository.findOne(
          updateCategoryDto.parent_id,
        );
        if (!parentCategory) {
          throw new NotFoundException('父分类不存在');
        }
        // 防止将分类设置为自己的子分类
        if (updateCategoryDto.parent_id === id) {
          throw new BadRequestException('不能将分类设置为自己的子分类');
        }
      }

      // 检查板块是否存在
      if (updateCategoryDto.b_section_id) {
        const section = await this.categoryRepository.findSectionById(
          updateCategoryDto.b_section_id,
        );
        if (!section) {
          throw new NotFoundException('所属板块不存在');
        }
      }

      // 检查分类名称是否已存在（排除自身）
      if (
        updateCategoryDto.name &&
        updateCategoryDto.name !== existingCategory.name
      ) {
        const existingName = await this.categoryRepository.findByName(
          updateCategoryDto.name,
        );
        if (existingName) {
          throw new ConflictException('分类名称已存在');
        }
      }

      return await this.categoryRepository.update(id, updateCategoryDto);
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('更新分类失败：' + error.message);
    }
  }

  async remove(id: number) {
    try {
      // 检查分类是否存在
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw new NotFoundException('分类不存在');
      }

      // 检查是否有子分类
      const hasChildren = await this.categoryRepository.hasChildren(id);
      if (hasChildren) {
        throw new BadRequestException('该分类下存在子分类，无法删除');
      }

      return await this.categoryRepository.delete(id);
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('删除分类失败：' + error.message);
    }
  }

  async findTree() {
    try {
      return await this.categoryRepository.findTree();
    } catch (error: any) {
      throw new BadRequestException('获取分类树失败：' + error.message);
    }
  }
}
