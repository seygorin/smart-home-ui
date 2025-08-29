import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'smart_home_token'
  private readonly authenticationState = new BehaviorSubject<boolean>(false)

  readonly isAuthenticated$ = this.authenticationState.asObservable()

  constructor() {
    this.authenticationState.next(this.hasToken())
  }

  getToken(): string | undefined {
    try {
      if (!this.isLocalStorageAvailable()) {
        return undefined
      }

      const token = localStorage.getItem(this.TOKEN_KEY)
      return token ?? undefined
    } catch (error) {
      console.error('Error retrieving token from localStorage:', error)
      return undefined
    }
  }

  setToken(token: string): void {
    try {
      if (!this.isValidToken(token)) {
        throw new Error('Invalid token provided')
      }

      if (!this.isLocalStorageAvailable()) {
        console.warn('localStorage not available, token cannot be stored')
        return
      }

      localStorage.setItem(this.TOKEN_KEY, token.trim())

      this.authenticationState.next(true)
    } catch (error) {
      console.error('Error storing token in localStorage:', error)
      this.authenticationState.next(false)
    }
  }

  clearToken(): void {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn('localStorage not available, token cannot be cleared')
        return
      }

      localStorage.removeItem(this.TOKEN_KEY)

      this.authenticationState.next(false)
    } catch (error) {
      console.error('Error clearing token from localStorage:', error)
      this.authenticationState.next(false)
    }
  }

  hasToken(): boolean {
    const token = this.getToken()
    return this.isValidToken(token)
  }

  isValidToken(token: string | undefined): boolean {
    if (!token) {
      return false
    }

    if (typeof token !== 'string' || token.trim().length === 0) {
      return false
    }

    return token.trim().length > 0
  }

  isAuthenticated(): boolean {
    return this.hasToken()
  }

  private isLocalStorageAvailable(): boolean {
    try {
      if (
        globalThis.window === undefined ||
        typeof localStorage === 'undefined'
      ) {
        return false
      }

      return true
    } catch (error) {
      console.warn('localStorage is not available:', error)
      return false
    }
  }

  refreshAuthenticationState(): void {
    this.authenticationState.next(this.hasToken())
  }
}
