import {Injectable, inject} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {Observable, combineLatest} from 'rxjs'
import {map, take} from 'rxjs/operators'

import {DashboardService} from './dashboard.service'
import {DashboardInfo, DashboardData} from '../../shared/models'

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router)
  private readonly dashboardService = inject(DashboardService)

  navigateToDashboard(
    dashboardId: string,
    tabId?: string,
    replaceUrl = false
  ): Promise<boolean> {
    const route = tabId
      ? ['/dashboard', dashboardId, tabId]
      : ['/dashboard', dashboardId]

    return this.router.navigate(route, {replaceUrl})
  }

  navigateToNewDashboard(dashboardId: string): Promise<boolean> {
    return this.dashboardService
      .getDashboardData(dashboardId)
      .pipe(take(1))
      .toPromise()
      .then((dashboardData) => {
        if (dashboardData && dashboardData.tabs.length > 0) {
          const firstTab = dashboardData.tabs[0]
          return this.navigateToDashboard(dashboardId, firstTab.id)
        } else {
          return this.navigateToDashboard(dashboardId)
        }
      })
      .catch(() => {
        return this.navigateToDashboard(dashboardId)
      })
  }

  navigateToFirstAvailableDashboard(): Promise<boolean> {
    const currentDashboards = this.dashboardService.getCurrentDashboards()

    if (currentDashboards && currentDashboards.length > 0) {
      const firstDashboard = currentDashboards[0]
      return this.navigateToNewDashboard(firstDashboard.id)
    } else {
      return this.router.navigate(['/'], {replaceUrl: true})
    }
  }

  navigateToTab(tabId: string, replaceUrl = false): Promise<boolean> {
    const currentRoute = this.router.routerState.root.firstChild
    if (currentRoute) {
      const dashboardId = currentRoute.snapshot.paramMap.get('dashboardId')
      if (dashboardId) {
        return this.navigateToDashboard(dashboardId, tabId, replaceUrl)
      }
    }

    const firstDashboard = this.dashboardService.getFirstAvailableDashboard()
    if (firstDashboard) {
      return this.navigateToDashboard(firstDashboard.id, tabId, replaceUrl)
    }

    return Promise.resolve(false)
  }

  getCurrentRouteParams(): Observable<{
    dashboardId: string | null
    tabId: string | null
  }> {
    return combineLatest([this.router.events]).pipe(
      map(() => {
        const route = this.router.routerState.root.firstChild
        if (route) {
          return {
            dashboardId: route.snapshot.paramMap.get('dashboardId'),
            tabId: route.snapshot.paramMap.get('tabId'),
          }
        }
        return {dashboardId: null, tabId: null}
      })
    )
  }

  isInEditMode(): boolean {
    return false
  }

  navigatePreservingEditMode(
    dashboardId: string,
    tabId?: string
  ): Promise<boolean> {
    return this.navigateToDashboard(dashboardId, tabId)
  }

  handleFallbackNavigation(): Promise<boolean> {
    return this.navigateToFirstAvailableDashboard()
  }

  navigateWithValidation(
    dashboardId: string,
    tabId?: string
  ): Promise<boolean> {
    return this.dashboardService
      .getDashboards()
      .pipe(take(1))
      .toPromise()
      .then((dashboards) => {
        if (!dashboards) {
          return this.handleFallbackNavigation()
        }

        const dashboardExists = dashboards.some((d) => d.id === dashboardId)
        if (!dashboardExists) {
          return this.handleFallbackNavigation()
        }

        if (!tabId) {
          return this.navigateToDashboard(dashboardId)
        }

        return this.dashboardService
          .getDashboardData(dashboardId)
          .pipe(take(1))
          .toPromise()
          .then((dashboardData) => {
            if (
              dashboardData &&
              dashboardData.tabs.some((tab) => tab.id === tabId)
            ) {
              return this.navigateToDashboard(dashboardId, tabId)
            } else {
              if (dashboardData && dashboardData.tabs.length > 0) {
                return this.navigateToDashboard(
                  dashboardId,
                  dashboardData.tabs[0].id,
                  true
                )
              } else {
                return this.navigateToDashboard(dashboardId, undefined, true)
              }
            }
          })
          .catch(() => {
            return this.navigateToDashboard(dashboardId)
          })
      })
      .catch(() => {
        return this.handleFallbackNavigation()
      })
  }
}
