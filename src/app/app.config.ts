import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  ErrorHandler,
} from '@angular/core'
import {provideRouter} from '@angular/router'
import {provideHttpClient, withInterceptors} from '@angular/common/http'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import {provideStore} from '@ngrx/store'
import {provideEffects} from '@ngrx/effects'
import {provideStoreDevtools} from '@ngrx/store-devtools'

import {routes} from './app.routes'
import {authInterceptor} from './core/interceptors/auth.interceptors'
import {errorInterceptor} from './core/interceptors/error.interceptor'
import {GlobalErrorHandler} from './core/services/global-error-handler.service'
import {appReducers} from './store/app.reducer'
import {DashboardEffects} from './store/dashboard/dashboard.effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    provideAnimationsAsync(),
    provideStore(appReducers),
    provideEffects([DashboardEffects]),
    {provide: ErrorHandler, useClass: GlobalErrorHandler},

    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
}
