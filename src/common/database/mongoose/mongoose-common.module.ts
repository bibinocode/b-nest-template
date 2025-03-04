import { Module } from '@nestjs/common';
import { MongooseConfigService } from './mongoose-config.sevice';
import { MongooseModule } from './mongoose.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature([]),
  ],
})
export class MongooseCommonModule {}
