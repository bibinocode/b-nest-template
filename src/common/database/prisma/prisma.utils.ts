import { Logger } from '@nestjs/common';
import { catchError, Observable, retry, throwError, timer } from 'rxjs';

export const PROTOCOL_REGEX = /^(.*?):\/\//;

export function getDBTYpe(url: string) {
  const matches = url.match(PROTOCOL_REGEX);

  const protocol = matches ? matches[1] : 'file';

  return protocol === 'file' ? 'sqlite' : protocol;
}

export function handleRetry(retryAttempts: number, retryDelay: number) {
  const logger = new Logger('PrismaModule');
  // 延迟逻辑
  return <T>(source: Observable<T>) =>
    source.pipe(
      retry({
        count: retryAttempts < 0 ? Infinity : retryAttempts,
        delay: (error, retryCount) => {
          const attempts = retryAttempts < 0 ? Infinity : retryAttempts;
          if (retryCount <= attempts) {
            logger.error(
              `重试第${retryCount}次,错误信息:${error.stack || error}`,
            );
            return timer(retryDelay);
          } else {
            return throwError(() => new Error('重试完成,数据库连接失败  '));
          }
        },
      }),
      catchError((error: any) => {
        logger.error(
          `重试超时 ${retryAttempts} times. ${error.stack || error}`,
        );
        return throwError(() => error);
      }),
    );
}
