import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { IsOptional, IsString, Length, IsIn } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @Length(2, 45, { message: '昵称长度必须在2-45个字符之间' })
  nickname?: string;

  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;

  @IsOptional()
  @IsIn([1, 2], { message: '性别只能是1(女)或2(男)' })
  sex?: number;

  @IsOptional()
  @IsString({ message: '个性签名必须是字符串' })
  @Length(0, 255, { message: '个性签名长度不能超过255个字符' })
  signature?: string;
}
