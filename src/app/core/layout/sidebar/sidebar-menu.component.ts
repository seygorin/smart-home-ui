import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  @Output() menuItemClick = new EventEmitter<string>();
  @Input() activeItem = 'overview';

  menuItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'lights', label: 'Lights', icon: 'lightbulb' },
    { id: 'about', label: 'About', icon: 'info' },
  ];

  selectMenuItem(id: string): void {
    this.menuItemClick.emit(id);
  }
}
