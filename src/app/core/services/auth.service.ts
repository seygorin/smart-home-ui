import {Injectable, inject} from '@angular/core'
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {Router} from '@angular/router'
import {BehaviorSubject, Observable, throwError} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'

import {TokenService} from './token.service'
import {LoginRequest, LoginResponse, UserProfile} from '../../shared/models'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly tokenService = inject(TokenService)
  private readonly router = inject(Router)

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false)
  private readonly userProfileSubject = new BehaviorSubject<
    UserProfile | undefined
  >(undefined)
  private readonly authCheckCompleteSubject = new BehaviorSubject<boolean>(
    false
  )

  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable()
  public readonly userProfile$ = this.userProfileSubject.asObservable()
  public readonly authCheckComplete$ =
    this.authCheckCompleteSubject.asObservable()

  constructor() {
    this.checkAuthStatus()
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/user/login', credentials).pipe(
      tap((response) => {
        this.tokenService.setToken(response.token)
        this.loadUserProfile()
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Unknown error occurred. Please try again later.'

        if (error.status === 401) {
          errorMessage = 'Invalid login or password.'
        }

        return throwError(() => new Error(errorMessage))
      })
    )
  }

  logout(): void {
    this.tokenService.clearToken()
    this.isAuthenticatedSubject.next(false)
    this.userProfileSubject.next(undefined)
    this.router.navigate(['/login'])
  }

  checkAuthStatus(): void {
    if (this.tokenService.hasToken()) {
      this.loadUserProfile()
    } else {
      this.isAuthenticatedSubject.next(false)
      this.userProfileSubject.next(undefined)
      this.authCheckCompleteSubject.next(true)
    }
  }

  private loadUserProfile(): void {
    this.http
      .get<UserProfile>('/api/user/profile')
      .pipe(
        tap((profile) => {

          this.isAuthenticatedSubject.next(true)
          this.userProfileSubject.next(profile)
          this.authCheckCompleteSubject.next(true)
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.tokenService.clearToken()
            this.isAuthenticatedSubject.next(false)
            this.userProfileSubject.next(undefined)
            this.authCheckCompleteSubject.next(true)
            this.router.navigate(['/login'])
          } else {
            this.isAuthenticatedSubject.next(false)
            this.userProfileSubject.next(undefined)
            this.authCheckCompleteSubject.next(true)
          }

          return throwError(() => error)
        })
      )
      .subscribe()
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value
  }

  getUserProfile(): UserProfile | undefined {
    return this.userProfileSubject.value
  }
}
