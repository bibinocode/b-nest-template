import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('板块')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @ApiOperation({ summary: '创建板块' })
  @Post()
  async create(@Body() createSectionDto: CreateSectionDto) {
    try {
      return await this.sectionsService.create(createSectionDto);
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error);
    }
  }

  @ApiOperation({ summary: '获取所有板块' })
  @Get()
  findAll() {
    return this.sectionsService.findAll();
  }

  @ApiOperation({ summary: '获取板块' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(+id);
  }

  @ApiOperation({ summary: '更新板块' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(+id, updateSectionDto);
  }

  @ApiOperation({ summary: '删除板块' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(+id);
  }
}
