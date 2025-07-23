
import { Component } from '@angular/core';
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

  onToggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onTabSelected(tabId: string): void {
    console.log('Selected tab:', tabId);
  }
}
