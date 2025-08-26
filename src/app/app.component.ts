import {Component, HostListener, ViewChild, OnInit, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterOutlet, Router} from '@angular/router'
import {MatSidenavModule, MatSidenav} from '@angular/material/sidenav'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'

import {SidebarComponent} from './core/layout/sidebar/sidebar.component'
import {AuthService} from './core/services/auth.service'

interface DashboardSelectedEvent {
  dashboardId: string
  tabId?: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  @ViewChild('sidenav') sidenav!: MatSidenav

  isAuthenticated$ = this.authService.isAuthenticated$

  isCollapsed = false
  isMobile = window.innerWidth < 768
  isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

  constructor() {
    if (this.isMobile) {
      this.isCollapsed = true
    }
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (!isAuthenticated && !this.isOnAuthRoute()) {
        this.router.navigate(['/login'])
      }
    })
  }

  private isOnAuthRoute(): boolean {
    const currentUrl = this.router.url
    return currentUrl.includes('/login') || currentUrl.includes('/404')
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile

    this.isMobile = window.innerWidth < 768
    this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

    if (wasMobile && !this.isMobile) {
      this.isCollapsed = false
    } else if (!wasMobile && this.isMobile) {
      this.isCollapsed = true
    }
  }

  get sidenavMode(): 'over' | 'side' {
    return this.isMobile ? 'over' : 'side'
  }

  get sidenavOpened(): boolean {
    if (this.isMobile) {
      return !this.isCollapsed
    }
    return true
  }

  onToggleCollapse(): void {
    if (this.isMobile) {
      if (this.isCollapsed) {
        this.sidenav.open()
        this.isCollapsed = false
      } else {
        this.sidenav.close()
        this.isCollapsed = true
      }
    } else {
      this.isCollapsed = !this.isCollapsed
    }
  }

  onTabSelected(dashboardId: string): void {

    this.router.navigate(['/dashboard', dashboardId])

    if (this.isMobile && this.sidenav.opened) {
      this.sidenav.close()
      this.isCollapsed = true
    }
  }

  onSidenavClosed(): void {
    if (this.isMobile) {
      this.isCollapsed = true
    }
  }

  onDashboardSelected(event: DashboardSelectedEvent): void {
    if (event.tabId) {
      this.router.navigate(['/dashboard', event.dashboardId, event.tabId])
    } else {
      this.router.navigate(['/dashboard', event.dashboardId])
    }

    if (this.isMobile && this.sidenav.opened) {
      this.sidenav.close()
      this.isCollapsed = true
    }
  }
}
