import { Component } from '@angular/core';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, DashboardComponent],
  template: `
    <div class="layout">
      <app-sidebar />
      <app-dashboard />
    </div>
  `,
})
export class AppComponent {}
