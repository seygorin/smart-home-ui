import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [MatListModule],
  template: `
    <mat-nav-list>
      <a mat-list-item>
        <span>Dashboard</span>
      </a>
    </mat-nav-list>
  `,
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent {}
