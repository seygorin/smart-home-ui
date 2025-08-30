import {Component, Input, Output, EventEmitter, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatDialog} from '@angular/material/dialog'
import {UserProfile} from '../../../shared/models'
import {DashboardCreationModalComponent} from '../../../shared/ui/dashboard-creation-modal/dashboard-creation-modal.component'

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar-footer.component.html',
  styleUrl: './sidebar-footer.component.scss',
})
export class SidebarFooterComponent {
  private readonly dialog = inject(MatDialog)

  @Input() isCollapsed = false
  @Input() userProfile: UserProfile | undefined
  @Output() logout = new EventEmitter<void>()

  onLogout(): void {
    this.logout.emit()
  }

  onAddDashboard(): void {
    const dialogRef = this.dialog.open(DashboardCreationModalComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dashboard creation initiated:', result)
      }
    })
  }
}
