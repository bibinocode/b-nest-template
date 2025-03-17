import { Module } from '@nestjs/common';
// import { MongooseCommonModule } from './mongoose/mongoose-common.module';
import { PrismaCommonModule } from './prisma/prisma-common.module';
// import { TypeormCommonModule } from './typeorm/typeorm-common.module';

@Module({
  imports: [PrismaCommonModule], // 我这里只用 Prisma
})
export class DatabaseModule {}
