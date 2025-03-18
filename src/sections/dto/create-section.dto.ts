import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
  MaxLength,
  Max,
  Length,
} from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty({ message: '板块名称不能为空' })
  @IsString({ message: '板块名称必须为字符串' })
  @Length(1, 45, { message: '板块名称长度必须在1到45之间' })
  @ApiProperty({ description: '板块名称', example: '板块名称', required: true })
  name!: string;

  @IsNotEmpty({ message: '板块标识不能为空' })
  @IsString({ message: '板块标识必须为字符串' })
  @Length(1, 45, { message: '板块标识长度必须在1到45之间' })
  @ApiProperty({ description: '板块标识', example: 'react', required: true })
  slug!: string;

  @IsOptional()
  @MaxLength(255, { message: '板块描述不能超过255个字符' })
  @ApiProperty({
    description: '板块描述',
    example: 'vue是最好的框架',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsInt({ message: '排序值必须为整数' })
  @Min(0, { message: '排序值不能小于0' })
  @ApiProperty({ description: '排序值', example: 0, required: false })
  sort_order?: number;

  @IsOptional()
  @IsInt({ message: '是否推荐必须为整数' })
  @Min(0, { message: '是否推荐不能小于0' })
  @Max(1, { message: '是否推荐不能大于1' })
  @ApiProperty({
    description: '是否推荐',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  is_featured?: number;
}
