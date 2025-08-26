import {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {Router} from '@angular/router'
import {catchError, tap, throwError} from 'rxjs'

import {TokenService} from '../services/token.service'

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)

  let url = request.url
  if (!url.startsWith('http') && !url.startsWith('/api')) {
    url = `/api${url.startsWith('/') ? url : `/${url}`}`
  }

  let modifiedRequest = request.clone({url})

  const token = tokenService.getToken()
  if (token) {
    modifiedRequest = modifiedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return next(modifiedRequest).pipe(
    tap(() => {
    }),
    catchError((error) => {
      console.error(
        `[HTTP Error] ${error.status} ${modifiedRequest.method} ${modifiedRequest.url}`,
        {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
        }
      )

      if (error.status === 401) {
        tokenService.clearToken()
        router.navigate(['/login'])
      }

      return throwError(() => error)
    })
  )
}
