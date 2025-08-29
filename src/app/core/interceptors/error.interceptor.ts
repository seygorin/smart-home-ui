import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http'
import {inject} from '@angular/core'
import {catchError, retry, timer, mergeMap, throwError} from 'rxjs'

import {NotificationService} from '../../shared/services/notification.service'
import {ErrorHandlerService} from '../services/error-handler.service'

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService)
  const errorHandlerService = inject(ErrorHandlerService)

  return next(request).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (
          error.status >= 500 ||
          error.status === 0 ||
          error.error?.name === 'TimeoutError'
        ) {
          const delay = Math.pow(2, retryCount) * 1000 
          console.log(
            `Retrying request (attempt ${
              retryCount + 1
            }/3) after ${delay}ms delay`
          )
          return timer(delay)
        }
        return throwError(() => error)
      },
    }),
    catchError((error: HttpErrorResponse) => {
      const handledError = errorHandlerService.handleHttpError(error, request)

      if (error.status !== 401) {
        notificationService.error(handledError.userMessage)
      }

      return throwError(() => handledError)
    })
  )
}
