import { IsString, IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @IsNotEmpty({ message: '分类名称不能为空' })
  name!: string;

  @ApiPropertyOptional({ description: '所属板块ID' })
  @IsInt()
  @IsNotEmpty({ message: '所属板块ID不能为空' })
  b_section_id!: number;

  @ApiPropertyOptional({ description: '分类描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '排序顺序', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sort_order?: number;

  @ApiPropertyOptional({ description: '父分类ID' })
  @IsInt()
  @IsOptional()
  parent_id?: number;
}
