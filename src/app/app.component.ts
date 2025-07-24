import { Component, HostListener, ViewChild } from '@angular/core';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent,
    DashboardComponent,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isCollapsed = false;
  isMobile = window.innerWidth < 768;
  isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  constructor() {
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;

    this.isMobile = window.innerWidth < 768;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (wasMobile && !this.isMobile) {
      this.isCollapsed = false;
    } else if (!wasMobile && this.isMobile) {
      this.isCollapsed = true;
    }
  }

  get sidenavMode(): 'over' | 'side' {
    return this.isMobile ? 'over' : 'side';
  }

  get sidenavOpened(): boolean {
    if (this.isMobile) {
      return !this.isCollapsed;
    }
    return true; 
  }

  onToggleCollapse(): void {
    if (this.isMobile) {
      if (this.isCollapsed) {
        this.sidenav.open();
        this.isCollapsed = false;
      } else {
        this.sidenav.close();
        this.isCollapsed = true;
      }
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  onTabSelected(tabId: string): void {
    console.log('Selected tab:', tabId);
    if (this.isMobile && this.sidenav.opened) {
      this.sidenav.close();
      this.isCollapsed = true;
    }
  }

  onSidenavClosed(): void {
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }
}
