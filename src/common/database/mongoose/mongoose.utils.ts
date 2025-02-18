import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
  verboseRetryLog = false,
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger('MongooseModule');
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error) => {
            const verboseMessage = verboseRetryLog
              ? ` Message: ${error.message}.`
              : '';
            const retryMessage =
              retryAttempts > 0 ? ` Retrying (${errorCount + 1})...` : '';

            logger.error(
              [
                'Unable to connect to the database.',
                verboseMessage,
                retryMessage,
              ].join(''),
              error.stack,
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}
