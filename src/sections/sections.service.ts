import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionsRepository } from './sections.repository';

@Injectable()
export class SectionsService {
  constructor(private sectionsRepository: SectionsRepository) {}

  async create(createSectionDto: CreateSectionDto) {
    // 1. 查找板块 slug 是否存在
    const isSlugExist = await this.sectionsRepository.findBySlug(
      createSectionDto.slug,
    );
    if (isSlugExist) {
      throw new BadRequestException('板块 slug 已存在');
    }

    // 2. 查找板块名称是否重复
    const isNameExist = await this.sectionsRepository.findByName(
      createSectionDto.name,
    );
    if (isNameExist) {
      throw new BadRequestException('板块名称已存在');
    }

    return this.sectionsRepository.create(createSectionDto);
  }

  async findAll() {
    return this.sectionsRepository.findAll();
  }

  async findOne(id: number) {
    try {
      return this.sectionsRepository.findOne(id);
    } catch (error) {
      console.log('error', error);
      throw new NotFoundException('板块不存在');
    }
  }

  async update(id: number, updateSectionDto: CreateSectionDto) {
    return this.sectionsRepository.update(id, updateSectionDto);
  }

  async remove(id: number) {
    return this.sectionsRepository.delete(id);
  }
}
