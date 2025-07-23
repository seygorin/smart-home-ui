import { Component, HostListener } from '@angular/core';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
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
  isCollapsed = false;
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    if (wasMobile && !this.isMobile) {
    } else if (!wasMobile && this.isMobile) {
      this.isCollapsed = true;
    }
  }

  onToggleCollapse(): void {
    if (this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  onTabSelected(tabId: string): void {
    console.log('Selected tab:', tabId);
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }
}
