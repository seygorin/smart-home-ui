import {Injectable, inject} from '@angular/core'
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {BehaviorSubject, Observable, of} from 'rxjs'
import {tap, catchError, shareReplay} from 'rxjs/operators'

import {
  DashboardInfo,
  DashboardData,
  CreateDashboardRequest,
  DeviceItem,
  SensorItem,
} from '../../shared/models'
import {RetryService} from '../../shared/services/retry.service'

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient)
  private readonly retryService = inject(RetryService)
  private readonly baseUrl = '/api'

  private readonly dashboardsSubject = new BehaviorSubject<DashboardInfo[]>([])
  private readonly loadingSubject = new BehaviorSubject<boolean>(false)
  private readonly errorSubject = new BehaviorSubject<string | undefined>(
    undefined
  )

  public readonly dashboards$ = this.dashboardsSubject.asObservable()
  public readonly loading$ = this.loadingSubject.asObservable()
  public readonly error$ = this.errorSubject.asObservable()

  private dashboardDataCache = new Map<string, Observable<DashboardData>>()
  private dashboardsCache: Observable<DashboardInfo[]> | undefined = undefined

  getDashboards(): Observable<DashboardInfo[]> {
    if (this.dashboardsCache) {
      return this.dashboardsCache
    }

    this.loadingSubject.next(true)
    this.errorSubject.next(undefined)

    this.dashboardsCache = this.retryService
      .withRetry(this.http.get<DashboardInfo[]>(`${this.baseUrl}/dashboards`), {
        maxRetries: 2,
        delay: 1000,
      })
      .pipe(
        tap((dashboards) => {
          this.dashboardsSubject.next(dashboards)
          this.loadingSubject.next(false)
          this.errorSubject.next(undefined)
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading dashboards:', error)
          this.loadingSubject.next(false)

          const errorMessage = this.getErrorMessage(error)
          this.errorSubject.next(errorMessage)

          this.dashboardsSubject.next([])
          return of([])
        }),
        shareReplay(1)
      )

    return this.dashboardsCache
  }

  getDashboardData(dashboardId: string): Observable<DashboardData> {
    const cachedData = this.dashboardDataCache.get(dashboardId)
    if (cachedData) {
      return cachedData
    }

    const dashboardData$ = this.retryService
      .withRetry(
        this.http.get<DashboardData>(
          `${this.baseUrl}/dashboards/${dashboardId}`
        ),
        {maxRetries: 2, delay: 1000}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(
            `Error loading dashboard data for ${dashboardId}:`,
            error
          )

          const emptyData: DashboardData = {tabs: []}
          return of(emptyData)
        }),
        shareReplay(1)
      )

    this.dashboardDataCache.set(dashboardId, dashboardData$)
    return dashboardData$
  }

  getFirstAvailableDashboard(): DashboardInfo | undefined {
    const dashboards = this.dashboardsSubject.value
    return dashboards.length > 0 ? dashboards[0] : undefined
  }

  getDashboardById(id: string): DashboardInfo | undefined {
    return this.dashboardsSubject.value.find((d) => d.id === id)
  }

  getCurrentDashboards(): DashboardInfo[] {
    return this.dashboardsSubject.value
  }

  hasDashboards(): boolean {
    return this.dashboardsSubject.value.length > 0
  }

  refreshDashboards(): Observable<DashboardInfo[]> {
    this.clearCache()
    return this.getDashboards()
  }

  clearDashboardDataCache(dashboardId: string): void {
    this.dashboardDataCache.delete(dashboardId)
  }

  clearCache(): void {
    this.dashboardsCache = undefined
    this.dashboardDataCache.clear()
    this.errorSubject.next(undefined)
  }

  createDashboard(
    dashboard: CreateDashboardRequest
  ): Observable<DashboardInfo> {
    return this.http
      .post<DashboardInfo>(`${this.baseUrl}/dashboards`, dashboard)
      .pipe(
        tap(() => {
          this.clearCache()
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error creating dashboard:', error)
          throw error
        })
      )
  }

  updateDashboard(
    dashboardId: string,
    dashboard: DashboardData
  ): Observable<DashboardData> {
    return this.http
      .put<DashboardData>(
        `${this.baseUrl}/dashboards/${dashboardId}`,
        dashboard
      )
      .pipe(
        tap(() => {
          this.clearDashboardDataCache(dashboardId)
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(`Error updating dashboard ${dashboardId}:`, error)
          throw error
        })
      )
  }

  deleteDashboard(dashboardId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/dashboards/${dashboardId}`)
      .pipe(
        tap(() => {
          this.clearCache()
          this.clearDashboardDataCache(dashboardId)
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(`Error deleting dashboard ${dashboardId}:`, error)
          throw error
        })
      )
  }

  getDevices(): Observable<(DeviceItem | SensorItem)[]> {
    return this.http
      .get<(DeviceItem | SensorItem)[]>(`${this.baseUrl}/devices`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading devices:', error)

          return of([])
        })
      )
  }

  updateDeviceState(deviceId: string, state: boolean): Observable<DeviceItem> {
    return this.retryService
      .withRetry(
        this.http.patch<DeviceItem>(`${this.baseUrl}/devices/${deviceId}`, {
          state,
        }),
        {maxRetries: 2, delay: 500}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Error updating device state for ${deviceId}:`, error)
          throw error
        })
      )
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.'
    }

    if (error.status >= 500) {
      return 'Server error occurred. Please try again later.'
    }

    if (error.status === 404) {
      return 'Dashboards not found.'
    }

    if (error.status === 401 || error.status === 403) {
      return 'You are not authorized to access dashboards.'
    }

    return (
      error.error?.message ||
      'An unexpected error occurred while loading dashboards.'
    )
  }
}
