import {
  Controller,
  Get,
  Inject,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController implements OnModuleInit {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService;

  constructor(private readonly appService: AppService) {}

  onModuleInit() {
    this.logger.log('AppController constructor');
    this.logger.error('AppController constructor');
    this.logger.warn('AppController constructor');
    this.logger.debug('AppController constructor');
    this.logger.verbose('AppController constructor');
  }

  @Get()
  async getHello() {
    console.log(await this.appService.getHello());
  }
}
