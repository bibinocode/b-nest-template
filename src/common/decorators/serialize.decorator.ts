import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptors';

export interface ClassConstructor<T> {
  new (...args: any[]): T;
}

/**
 * 序列化装饰器快捷使用
 * @param dto 需要序列化的DTO
 * @example
 * export class UserDto {
 *  id: number;
 *  name: string;
 *  @Exclude()
 *  password: string;
 * }
 *
 * @Serialize(UserDto)
 * class UserController {
 *  @Get()
 *  findAll() {
 *      return []
 *  }
 * }
 */
export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
