import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Controller,
  Get,
  Inject,
  LoggerService,
  OnModuleInit,
  Version,
} from '@nestjs/common';
import Redis from 'ioredis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService;

  constructor(private readonly appService: AppService,@InjectRedis() private readonly redis:Redis ) {}

  onModuleInit() {
    this.logger.log('AppController constructor');
    this.logger.error('AppController constructor');
    this.logger.warn('AppController constructor');
    this.logger.debug('AppController constructor');
    this.logger.verbose('AppController constructor');
  }

  @Get()
  @Version('2')
  async getHello() {
    return await this.redis.get('token')
  }

  @Get('set')
  @Version('2')
  async setToken() {
    // set('token','123456','EX', 60 * 60 * 24 * 30) 是什么意思
    // set('token','123456','EX', 60 * 60 * 24 * 30) 的意思是设置一个token，token的值为123456，过期时间为60 * 60 * 24 * 30秒
    // EX 是过期时间，单位是秒
    return await this.redis.set('token','123456','EX', 60 * 60 * 24 * 30)
  }
}
