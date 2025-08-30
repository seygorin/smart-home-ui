import {Injectable, inject} from '@angular/core'
import {BehaviorSubject, Observable, combineLatest} from 'rxjs'
import {map, distinctUntilChanged} from 'rxjs/operators'
import {Router, NavigationEnd} from '@angular/router'

import {DashboardService} from './dashboard.service'
import {NavigationService} from './navigation.service'
import {DashboardInfo} from '../../shared/models'

@Injectable({
  providedIn: 'root',
})
export class DashboardNavigationService {
  private readonly router = inject(Router)
  private readonly dashboardService = inject(DashboardService)
  private readonly navigationService = inject(NavigationService)

  private readonly activeDashboardIdSubject = new BehaviorSubject<
    string | null
  >(null)
  private readonly activeTabIdSubject = new BehaviorSubject<string | null>(null)

  public readonly activeDashboardId$ =
    this.activeDashboardIdSubject.asObservable()
  public readonly activeTabId$ = this.activeTabIdSubject.asObservable()

  constructor() {
    this.initializeRouteTracking()
  }

  private initializeRouteTracking(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveRouteParams()
      }
    })

    this.updateActiveRouteParams()
  }

  private updateActiveRouteParams(): void {
    const route = this.router.routerState.root.firstChild
    if (route) {
      const dashboardId = route.snapshot.paramMap.get('dashboardId')
      const tabId = route.snapshot.paramMap.get('tabId')

      this.activeDashboardIdSubject.next(dashboardId)
      this.activeTabIdSubject.next(tabId)
    } else {
      this.activeDashboardIdSubject.next(null)
      this.activeTabIdSubject.next(null)
    }
  }

  getActiveDashboard(): Observable<DashboardInfo | null> {
    return combineLatest([
      this.activeDashboardId$,
      this.dashboardService.dashboards$,
    ]).pipe(
      map(([activeDashboardId, dashboards]) => {
        if (!activeDashboardId) return null
        return dashboards.find((d) => d.id === activeDashboardId) || null
      }),
      distinctUntilChanged()
    )
  }

  isDashboardActive(dashboardId: string): Observable<boolean> {
    return this.activeDashboardId$.pipe(
      map((activeDashboardId) => activeDashboardId === dashboardId),
      distinctUntilChanged()
    )
  }

  navigateToDashboard(dashboardId: string, tabId?: string): Promise<boolean> {
    return this.navigationService.navigateToDashboard(dashboardId, tabId)
  }

  handleDashboardCreated(dashboardId: string): Promise<boolean> {
    return this.navigationService.navigateToNewDashboard(dashboardId)
  }
  handleDashboardDeleted(): Promise<boolean> {
    return this.navigationService.navigateToFirstAvailableDashboard()
  }

  refreshDashboardsAndMaintainState(): Observable<DashboardInfo[]> {
    return this.dashboardService.refreshDashboards()
  }

  getDashboardsWithActiveState(): Observable<
    Array<DashboardInfo & {isActive: boolean}>
  > {
    return combineLatest([
      this.dashboardService.dashboards$,
      this.activeDashboardId$,
    ]).pipe(
      map(([dashboards, activeDashboardId]) =>
        dashboards.map((dashboard) => ({
          ...dashboard,
          isActive: dashboard.id === activeDashboardId,
        }))
      )
    )
  }

  forceRefreshDashboards(): void {
    this.dashboardService.refreshDashboards().subscribe()
  }
}
