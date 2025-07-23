import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  @Output() menuItemClick = new EventEmitter<string>();

  menuItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'about', label: 'About' },
  ];

  onItemClick(id: string): void {
    this.menuItemClick.emit(id);
  }
}
