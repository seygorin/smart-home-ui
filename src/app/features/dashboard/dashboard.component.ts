import {Component, HostBinding, OnInit, OnDestroy, inject} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {CommonModule} from '@angular/common'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {Subject, combineLatest} from 'rxjs'
import {takeUntil, switchMap} from 'rxjs/operators'

import {Tab, Card, DashboardData, DashboardInfo} from '../../shared/models'
import {DashboardService} from '../../core/services/dashboard.service'
import {TabSwitcherComponent} from './tab-switcher/tab-switcher.component'
import {CardListComponent} from '../../shared/ui/card-list/card-list.component'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    TabSwitcherComponent,
    CardListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly dashboardService = inject(DashboardService)
  private readonly destroy$ = new Subject<void>()

  @HostBinding('class.tab-transition') tabTransition = false

  tabs: Tab[] = []
  selectedTabId = ''
  selectedCards: Card[] = []
  loading = true
  error: string | undefined = undefined

  ngOnInit(): void {
    this.dashboardService
      .getDashboards()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return combineLatest([
            this.route.paramMap,
            this.dashboardService.dashboards$,
          ])
        })
      )
      .subscribe({
        next: ([parameterMap, dashboards]) => {
          const dashboardId = parameterMap.get('dashboardId') ?? undefined
          const tabId = parameterMap.get('tabId') ?? undefined

          this.handleRouteParameters(dashboardId, tabId, dashboards)
        },
        error: (error) => {
          console.error('Error loading dashboard:', error)
          this.error = 'Failed to load dashboard data'
          this.loading = false
        },
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onTabSelected(tabId: string): void {
    if (this.selectedTabId !== tabId) {
      this.tabTransition = true

      const dashboardId =
        this.route.snapshot.paramMap.get('dashboardId') ?? undefined
      if (dashboardId) {
        this.router.navigate(['/dashboard', dashboardId, tabId])
      }

      this.selectedTabId = tabId
      const newCards = this.getCardsForTab(tabId)
      this.selectedCards = newCards

      setTimeout(() => {
        this.tabTransition = false
      }, 300)
    }
  }

  private handleRouteParameters(
    dashboardId: string | undefined,
    tabId: string | undefined,
    availableDashboards: DashboardInfo[]
  ): void {
    if (!dashboardId) {
      this.handleFallbackNavigation()
      return
    }

    const validDashboardId = this.validateDashboardId(
      dashboardId,
      availableDashboards
    )
    if (!validDashboardId) {
      this.handleFallbackNavigation()
      return
    }

    this.dashboardService
      .getDashboardData(validDashboardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dashboardData: DashboardData) => {
          this.tabs = dashboardData.tabs

          if (!tabId) {
            this.handleTabFallback(validDashboardId, this.tabs)
            return
          }

          const validTabId = this.validateTabId(tabId, this.tabs)
          if (!validTabId) {
            this.handleTabFallback(validDashboardId, this.tabs)
            return
          }

          this.selectedTabId = validTabId
          this.selectedCards = this.getCardsForTab(validTabId)
          this.loading = false
          this.error = undefined
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error)
          this.error = 'Failed to load dashboard data'
          this.loading = false
        },
      })
  }

  private validateDashboardId(
    dashboardId: string | undefined,
    availableDashboards: DashboardInfo[]
  ): string | undefined {
    if (!dashboardId) {
      return undefined
    }

    const dashboardExists = availableDashboards.some(
      (d) => d.id === dashboardId
    )
    return dashboardExists ? dashboardId : undefined
  }

  private validateTabId(
    tabId: string | undefined,
    tabs: Tab[]
  ): string | undefined {
    if (!tabId || tabs.length === 0) {
      return undefined
    }

    const tabExists = tabs.some((tab) => tab.id === tabId)
    return tabExists ? tabId : undefined
  }

  private handleFallbackNavigation(): void {
    const firstDashboard = this.dashboardService.getFirstAvailableDashboard()

    if (firstDashboard) {
      this.dashboardService
        .getDashboardData(firstDashboard.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dashboardData: DashboardData) => {
            const firstTab = dashboardData.tabs[0]
            if (firstTab) {
              this.router.navigate(
                ['/dashboard', firstDashboard.id, firstTab.id],
                {
                  replaceUrl: true,
                }
              )
            } else {
              this.error = 'No dashboard content available'
              this.loading = false
            }
          },
          error: () => {
            this.error = 'Failed to load dashboard data'
            this.loading = false
          },
        })
    } else {
      this.error = 'No dashboards available'
      this.loading = false
    }
  }

  private handleTabFallback(dashboardId: string, tabs: Tab[]): void {
    const firstTab = tabs[0]
    if (firstTab) {
      this.router.navigate(['/dashboard', dashboardId, firstTab.id], {
        replaceUrl: true,
      })
    } else {
      this.error = 'No content available for this dashboard'
      this.loading = false
    }
  }

  retryLoad(): void {
    this.loading = true
    this.error = undefined

    this.dashboardService.clearCache()

    this.ngOnInit()
  }

  private getCardsForTab(tabId: string): Card[] {
    const tab = this.tabs.find((tab) => tab.id === tabId)
    const cards = tab?.cards || []

    return cards
  }
}
