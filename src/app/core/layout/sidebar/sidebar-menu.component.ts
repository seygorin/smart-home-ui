import {Component, EventEmitter, Input, Output} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatListModule} from '@angular/material/list'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {DashboardInfo} from '../../../shared/models'

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  @Output() menuItemClick = new EventEmitter<string>()
  @Input() activeItem = ''
  @Input() isCollapsed = false
  @Input() dashboards: DashboardInfo[] = []
  @Input() isLoading = false

  selectMenuItem(id: string): void {
    this.menuItemClick.emit(id)
  }
}
