import { Module } from '@nestjs/common';
import { MongooseCommonModule } from './mongoose/mongoose-common.module';
import { PrismaCommonModule } from './prisma/prisma-common.module';
import { TypeormCommonModule } from './typeorm/typeorm-common.module';

@Module({
  imports: [TypeormCommonModule, PrismaCommonModule, MongooseCommonModule],
})
export class DatabaseModule {}
