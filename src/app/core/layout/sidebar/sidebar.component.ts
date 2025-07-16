import { Component } from '@angular/core';
import { SidebarHeaderComponent } from '../sidebar/sidebar-header.component';
import { SidebarMenuComponent } from '../sidebar/sidebar-menu.component';
import { SidebarFooterComponent } from '../sidebar/sidebar-footer.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarHeaderComponent,
    SidebarMenuComponent,
    SidebarFooterComponent,
  ],
  template: `
    <aside>
      <app-sidebar-header />
      <app-sidebar-menu />
      <app-sidebar-footer />
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {}
