import {Injectable, signal} from '@angular/core'
import {BehaviorSubject, Observable} from 'rxjs'

export interface LoadingState {
  [key: string]: boolean
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingState = signal<LoadingState>({})
  private loadingSubject = new BehaviorSubject<LoadingState>({})

  loading$ = this.loadingSubject.asObservable()

  loadingSignal = this.loadingState.asReadonly()

  setLoading(key: string, loading: boolean): void {
    const currentState = this.loadingState()
    const newState = {...currentState, [key]: loading}

    this.loadingState.set(newState)
    this.loadingSubject.next(newState)
  }

  isLoading(key: string): boolean {
    return this.loadingState()[key] || false
  }

  isAnyLoading(): boolean {
    const state = this.loadingState()
    return Object.values(state).some((loading) => loading)
  }

  getLoadingState(key: string): Observable<boolean> {
    return new Observable((subscriber) => {
      const subscription = this.loading$.subscribe((state) => {
        subscriber.next(state[key] || false)
      })
      return () => subscription.unsubscribe()
    })
  }

  clearAll(): void {
    this.loadingState.set({})
    this.loadingSubject.next({})
  }

  clear(key: string): void {
    const currentState = this.loadingState()
    const newState = {...currentState}
    delete newState[key]

    this.loadingState.set(newState)
    this.loadingSubject.next(newState)
  }
}
