import { CreateSectionDto } from '../dto/create-section.dto';
import { UpdateSectionDto } from '../dto/update-section.dto';

export abstract class SectionsAbstractRepository {
  abstract create(createSectionsDto: CreateSectionDto): Promise<any>;
  abstract findAll(): Promise<any>;
  abstract findOne(id: number): Promise<any>;
  abstract update(id: number, updateSectionDto: UpdateSectionDto): Promise<any>;
  abstract delete(id: number): Promise<any>;
  abstract findBySlug(slug: string): Promise<any>;
  abstract findByName(name: string): Promise<any>;
}
