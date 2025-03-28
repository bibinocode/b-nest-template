import { Module, forwardRef } from '@nestjs/common';
import { MongooseConfigService } from './mongoose-config.sevice';
import { MongooseModule } from './mongoose.module';

@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forRootAsync({
        useClass: MongooseConfigService,
      }),
    ),
    // forwardRef(() => MongooseModule.forFeature([])), 在具体模块引入
  ],
})
export class MongooseCommonModule {}
