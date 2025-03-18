import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsAbstractRepository } from './repository/sections.abstract.repository';
import { SectionsPrismaRepository } from './repository/sections.prisma.repository';

@Injectable()
export class SectionsRepository implements SectionsAbstractRepository {
  constructor(private sectionsPrismaRepository: SectionsPrismaRepository) {}

  getRepository() {
    return this.sectionsPrismaRepository;
  }

  delete(id: number): Promise<any> {
    const client = this.getRepository();
    return client.delete(id);
  }

  async create(createSectionDto: CreateSectionDto) {
    const client = this.getRepository();
    return client.create(createSectionDto);
  }

  async findAll() {
    const client = this.getRepository();
    return client.findAll();
  }

  async findOne(id: number) {
    const client = this.getRepository();
    return client.findOne(id);
  }

  async update(id: number, updateSectionDto: CreateSectionDto) {
    const client = this.getRepository();
    return client.update(id, updateSectionDto);
  }

  async remove(id: number) {
    const client = this.getRepository();
    return client.delete(id);
  }

  async findBySlug(slug: string) {
    const client = this.getRepository();
    return client.findBySlug(slug);
  }

  async findByName(name: string) {
    const client = this.getRepository();
    return client.findByName(name);
  }
}
