import {Injectable} from '@angular/core'
import {Observable, timer, throwError} from 'rxjs'
import {mergeMap, retryWhen} from 'rxjs/operators'

export interface RetryConfig {
  maxRetries?: number
  delay?: number
}

@Injectable({
  providedIn: 'root',
})
export class RetryService {
  private readonly defaultConfig: Required<RetryConfig> = {
    maxRetries: 3,
    delay: 1000,
  }

  withRetry<T>(source: Observable<T>, config: RetryConfig = {}): Observable<T> {
    const finalConfig = {...this.defaultConfig, ...config}

    return source.pipe(
      retryWhen((errors: Observable<any>) =>
        errors.pipe(
          mergeMap((error: any, index: number) => {
            if (index >= finalConfig.maxRetries) {
              console.error(`Max retries (${finalConfig.maxRetries}) exceeded`)
              return throwError(() => error)
            }

            console.log(
              `Retrying in ${finalConfig.delay}ms... (attempt ${index + 1})`
            )
            return timer(finalConfig.delay)
          })
        )
      )
    )
  }
}
