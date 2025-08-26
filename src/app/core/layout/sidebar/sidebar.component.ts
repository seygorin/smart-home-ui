import {
  Component,
  EventEmitter,
  Output,
  Input,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatListModule} from '@angular/material/list'
import {Subject, takeUntil} from 'rxjs'
import {SidebarHeaderComponent} from './sidebar-header.component'
import {SidebarMenuComponent} from './sidebar-menu.component'
import {SidebarFooterComponent} from './sidebar-footer.component'
import {AuthService} from '../../services/auth.service'
import {DashboardService} from '../../services/dashboard.service'
import {DashboardInfo, UserProfile} from '../../../shared/models'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    SidebarHeaderComponent,
    SidebarMenuComponent,
    SidebarFooterComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService)
  private readonly dashboardService = inject(DashboardService)
  private readonly destroy$ = new Subject<void>()

  @Input() isCollapsed = false
  @Output() tabSelected = new EventEmitter<string>()
  @Output() toggleCollapse = new EventEmitter<void>()

  isAuthenticated = false
  userProfile: UserProfile | undefined
  dashboards: DashboardInfo[] = []
  isLoading = false

  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth
        if (isAuth) {
          this.loadDashboards()
        } else {
          this.dashboards = []
        }
      })

    this.authService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.userProfile = profile
      })

    this.dashboardService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isLoading = loading
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadDashboards(): void {
    this.dashboardService
      .getDashboards()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dashboards) => {
        this.dashboards = dashboards
      })
  }

  onMenuItemClick(dashboardId: string): void {
    this.tabSelected.emit(dashboardId)
  }

  toggleSidebar(): void {
    this.toggleCollapse.emit()
  }

  onLogout(): void {
    this.authService.logout()
  }
}
