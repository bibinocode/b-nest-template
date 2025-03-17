import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

/**
 * 自定义序列化输出
 */
@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<any>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, {
          // 设置了true 之后,所有经过该拦截器的接口返回值都需要配置@Expose() 或者@Exclude()
          // @Expose() -> 需要暴露的属性
          // @Exclude() -> 不需要暴露的属性
          // 配置 false 好一点,只需要配置@Exclude() 的属性,其他属性都会暴露
          excludeExtraneousValues: false,
        });
      }),
    );
  }
}
