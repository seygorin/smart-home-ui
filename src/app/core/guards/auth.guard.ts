import {inject} from '@angular/core'
import {Router} from '@angular/router'
import {CanActivateFn} from '@angular/router'
import {combineLatest} from 'rxjs'
import {filter, map, take, tap} from 'rxjs/operators'

import {AuthService} from '../services/auth.service'


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return combineLatest([
    authService.isAuthenticated$,
    authService.authCheckComplete$,
  ]).pipe(
    filter(([, authCheckComplete]) => authCheckComplete), 	
    take(1),
    tap(([isAuthenticated]) => {
      if (!isAuthenticated) {
        router.navigate(['/login'])
      }
    }),
    map(([isAuthenticated]) => {
      return isAuthenticated
    })
  )
}
