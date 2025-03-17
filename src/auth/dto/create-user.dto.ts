import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户昵称', example: '张三' })
  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString({ message: '昵称必须是字符串' })
  @Length(2, 45, { message: '昵称长度必须在2-45个字符之间' })
  nickname!: string;

  @ApiProperty({ description: '用户名', example: 'zhangsan' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度必须在3-50个字符之间' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: '用户名只能包含字母、数字、下划线和连字符',
  })
  username!: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password!: string;

  @ApiProperty({ description: '邮箱', example: 'zhangsan@example.com' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email!: string;

  @ApiProperty({
    description: '头像URL',
    required: false,
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;

  @ApiProperty({
    description: '性别: 1=女, 2=男',
    required: false,
    enum: [1, 2],
    example: 2,
  })
  @IsOptional()
  @IsIn([1, 2], { message: '性别只能是1(女)或2(男)' })
  sex?: number;

  @ApiProperty({
    description: '个性签名',
    required: false,
    example: '这是我的个性签名',
  })
  @IsOptional()
  @IsString({ message: '个性签名必须是字符串' })
  @Length(0, 255, { message: '个性签名长度不能超过255个字符' })
  signature?: string;
}
