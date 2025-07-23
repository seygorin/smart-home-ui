import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.scss',
})
export class SidebarHeaderComponent {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();
}
