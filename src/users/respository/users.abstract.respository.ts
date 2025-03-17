import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from 'prisma-mysql';

export abstract class UserAbstractRepository {
  abstract create(createUserDto: CreateUserDto): Promise<Partial<Users>>;
  abstract findOne(id: number): Promise<Partial<Users> | null>;
  abstract findAll(): Promise<Partial<Users>[]>;
  abstract findByUsername(username: string): Promise<Users | null>;
  abstract findByEmail(email: string): Promise<Users | null>;
  abstract update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<Users>>;
  abstract remove(id: number): Promise<void>;
  abstract updateLastLoginIp(userId: number, ip: string): Promise<void>;
  abstract createLoginHistory(userId: number, ip: string): Promise<void>;
}
