import {Component, Input, Output, EventEmitter} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {UserProfile} from '../../../shared/models'

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar-footer.component.html',
  styleUrl: './sidebar-footer.component.scss',
})
export class SidebarFooterComponent {
  @Input() isCollapsed = false
  @Input() userProfile: UserProfile | undefined
  @Output() logout = new EventEmitter<void>()

  onLogout(): void {
    this.logout.emit()
  }
}
