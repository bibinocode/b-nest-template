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
  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString({ message: '昵称必须是字符串' })
  @Length(2, 45, { message: '昵称长度必须在2-45个字符之间' })
  nickname: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度必须在3-50个字符之间' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: '用户名只能包含字母、数字、下划线和连字符',
  })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

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
