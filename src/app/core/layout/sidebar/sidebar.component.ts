import { Component } from '@angular/core';
import { SidebarHeaderComponent } from '../sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { SidebarFooterComponent } from '../sidebar-footer/sidebar-footer.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarHeaderComponent,
    SidebarMenuComponent,
    SidebarFooterComponent,
  ],
  template: `
    <aside [class.collapsed]="isCollapsed">
      <app-sidebar-header (toggle)="isCollapsed = !isCollapsed" />
      <app-sidebar-menu />
      <app-sidebar-footer />
    </aside>
  `,
})
export class SidebarComponent {
  isCollapsed = window.innerWidth < 768;
}
