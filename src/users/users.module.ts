import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../common/database/prisma/prisma.module';
import { UsersRepository } from './users.repository';
import { UsersPrismaRepository } from './repository/users.prisma.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersPrismaRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
