import { Exclude } from 'class-transformer';
import { CreateUserDto } from '../../auth/dto/create-user.dto';

/**
 * 返回序列
 */
export class UsersInterface extends CreateUserDto {
  @Exclude()
  declare password: string;

  constructor(partial: Partial<UsersInterface>) {
    super();
    Object.assign(this, partial);
  }
}
