import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { SidebarHeaderComponent } from './sidebar-header.component';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { SidebarFooterComponent } from './sidebar-footer.component';

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
export class SidebarComponent {
  @Output() tabSelected = new EventEmitter<string>();

  onMenuItemClick(tabId: string): void {
    this.tabSelected.emit(tabId);
  }
}
