import {
  Component,
  HostBinding,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {CommonModule} from '@angular/common'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatDialog} from '@angular/material/dialog'
import {Subject, combineLatest} from 'rxjs'
import {takeUntil, switchMap} from 'rxjs/operators'
import {Store} from '@ngrx/store'

import {
  Tab,
  Card,
  DashboardData,
  DashboardInfo,
  CardLayout,
} from '../../shared/models'
import {DashboardService} from '../../core/services/dashboard.service'
import {DashboardValidationService} from '../../shared/services/dashboard-validation.service'
import {TabSwitcherComponent} from './tab-switcher/tab-switcher.component'
import {CardListComponent} from '../../shared/ui/card-list/card-list.component'
import {
  ConfirmationModalComponent,
  ConfirmationModalData,
} from '../../shared/ui/confirmation-modal/confirmation-modal.component'
import {
  CardContentModalComponent,
  CardContentModalData,
  CardContentModalResult,
} from '../../shared/ui/card-content-modal/card-content-modal.component'
import {AppState} from '../../store'
import * as DashboardActions from '../../store/dashboard/dashboard.actions'
import {
  selectEditMode,
  selectSelectedDashboard,
  selectSavingLoading,
  selectDashboardError,
  selectSavingError,
} from '../../store/dashboard/dashboard.selectors'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
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
  private readonly validationService = inject(DashboardValidationService)
  private readonly store = inject(Store<AppState>)
  private readonly dialog = inject(MatDialog)
  private readonly destroy$ = new Subject<void>()

  @HostBinding('class.tab-transition') tabTransition = false

  isEditMode = signal(false)

  editMode$ = this.store.select(selectEditMode)
  selectedDashboard$ = this.store.select(selectSelectedDashboard)
  savingLoading$ = this.store.select(selectSavingLoading)
  dashboardError$ = this.store.select(selectDashboardError)
  savingError$ = this.store.select(selectSavingError)

  canSave = computed(
    () => this.isEditMode() && !this.loading && !this.isSaving()
  )
  canDiscard = computed(() => this.isEditMode() && !this.isSaving())

  isSaving = signal(false)
  saveError = signal<string | null>(null)
  saveSuccess = signal(false)

  tabs: Tab[] = []
  selectedTabId = ''
  selectedCards: Card[] = []
  loading = true
  error: string | undefined = undefined
  dashboardInfo: DashboardInfo | undefined = undefined

  ngOnInit(): void {
    this.editMode$.pipe(takeUntil(this.destroy$)).subscribe((editMode) => {
      this.isEditMode.set(editMode)
    })

    this.savingLoading$.pipe(takeUntil(this.destroy$)).subscribe((isSaving) => {
      this.isSaving.set(isSaving)
    })

    this.savingError$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      this.saveError.set(error)
      if (error) {
        setTimeout(() => this.saveError.set(null), 5000)
      }
    })

    this.selectedDashboard$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dashboard) => {
        if (dashboard) {
          this.tabs = dashboard.tabs
          if (this.selectedTabId) {
            const currentTab = this.tabs.find(
              (tab) => tab.id === this.selectedTabId
            )
            if (currentTab) {
              this.selectedCards = currentTab.cards
            } else {
              if (this.tabs.length > 0) {
                const dashboardId =
                  this.route.snapshot.paramMap.get('dashboardId')
                if (dashboardId) {
                  this.router.navigate([
                    '/dashboard',
                    dashboardId,
                    this.tabs[0].id,
                  ])
                }
              }
            }
          }
        }
      })

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

    this.dashboardInfo = availableDashboards.find(
      (d) => d.id === validDashboardId
    )

    this.store.dispatch(
      DashboardActions.loadDashboard({dashboardId: validDashboardId})
    )

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

  enterEditMode(): void {
    this.store.dispatch(DashboardActions.enterEditMode())
  }

  exitEditMode(): void {
    this.store.dispatch(DashboardActions.exitEditMode())
  }

  saveDashboard(): void {
    const dashboardId = this.route.snapshot.paramMap.get('dashboardId')
    if (dashboardId && this.tabs.length > 0) {
      const dashboardData: DashboardData = {
        tabs: this.tabs,
      }
      this.saveError.set(null)
      this.saveSuccess.set(true)
      this.store.dispatch(
        DashboardActions.saveDashboard({
          dashboardId,
          dashboard: dashboardData,
        })
      )
    }
  }

  discardChanges(): void {
    this.store.dispatch(DashboardActions.discardChanges())
  }

  deleteDashboard(): void {
    const dashboardId = this.route.snapshot.paramMap.get('dashboardId')
    if (!dashboardId || !this.dashboardInfo) return

    const confirmationData: ConfirmationModalData = {
      title: 'Delete Dashboard',
      message: `Are you sure you want to delete "${this.dashboardInfo.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDestructive: true,
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: confirmationData,
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result === true) {
          this.store.dispatch(DashboardActions.deleteDashboard({dashboardId}))
        }
      })
  }

  onTabAdded(title: string): void {
    this.store.dispatch(DashboardActions.addTab({title}))

    const newTabId = this.validationService.generateIdFromTitle(title)
    const dashboardId = this.route.snapshot.paramMap.get('dashboardId')
    if (dashboardId) {
      setTimeout(() => {
        this.router.navigate(['/dashboard', dashboardId, newTabId])
      }, 100) 
    }
  }

  onTabRemoved(tabId: string): void {
    const tab = this.tabs.find((t) => t.id === tabId)
    if (!tab) return

    const confirmationData: ConfirmationModalData = {
      title: 'Delete Tab',
      message: `Are you sure you want to delete the tab "${tab.title}"? All cards in this tab will be permanently deleted.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDestructive: true,
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: confirmationData,
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result === true) {
          this.store.dispatch(DashboardActions.removeTab({tabId}))
        }
      })
  }

  onTabReordered(event: {tabId: string; direction: 'left' | 'right'}): void {
    this.store.dispatch(
      DashboardActions.reorderTab({
        tabId: event.tabId,
        direction: event.direction,
      })
    )
  }

  onTabRenamed(event: {tabId: string; title: string}): void {
    this.store.dispatch(
      DashboardActions.updateTabTitle({
        tabId: event.tabId,
        title: event.title,
      })
    )
  }

  onCardAdded(layout: CardLayout): void {
    if (this.selectedTabId) {
      this.store.dispatch(
        DashboardActions.addCard({
          tabId: this.selectedTabId,
          layout,
        })
      )
    }
  }

  onCardRemoved(cardId: string): void {
    if (this.selectedTabId) {
      this.store.dispatch(
        DashboardActions.removeCard({
          tabId: this.selectedTabId,
          cardId,
        })
      )
    }
  }

  onCardReordered(event: {cardId: string; newIndex: number}): void {
    if (this.selectedTabId) {
      this.store.dispatch(
        DashboardActions.reorderCard({
          tabId: this.selectedTabId,
          cardId: event.cardId,
          newIndex: event.newIndex,
        })
      )
    }
  }

  onCardContentEdited(cardId: string): void {
    if (!this.selectedTabId) return

    const card = this.selectedCards.find((c) => c.id === cardId)
    if (!card) return

    const modalData: CardContentModalData = {
      card,
      tabId: this.selectedTabId,
    }

    const dialogRef = this.dialog.open(CardContentModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      data: modalData,
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: CardContentModalResult | undefined) => {
        if (result) {
          if (result.title !== card.title) {
            this.store.dispatch(
              DashboardActions.updateCardTitle({
                tabId: this.selectedTabId,
                cardId,
                title: result.title || '',
              })
            )
          }

          this.store.dispatch(
            DashboardActions.replaceCardItems({
              tabId: this.selectedTabId,
              cardId,
              items: result.items,
            })
          )
        }
      })
  }
}
