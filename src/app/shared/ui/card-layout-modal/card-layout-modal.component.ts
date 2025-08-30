import {Component, inject, signal} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'

import {CardLayout} from '../../models'

@Component({
  selector: 'app-card-layout-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './card-layout-modal.component.html',
  styleUrl: './card-layout-modal.component.scss',
})
export class CardLayoutModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CardLayoutModalComponent>)

  selectedLayout = signal<CardLayout | null>(null)

  layoutOptions = [
    {
      value: 'singleDevice' as CardLayout,
      title: 'Single Device',
      description: 'Display one device or sensor',
      icon: 'crop_din',
    },
    {
      value: 'horizontalLayout' as CardLayout,
      title: 'Horizontal Layout',
      description: 'Display devices in a horizontal row',
      icon: 'view_column',
    },
    {
      value: 'verticalLayout' as CardLayout,
      title: 'Vertical Layout',
      description: 'Display devices in a vertical column',
      icon: 'view_agenda',
    },
  ]

  selectLayout(layout: CardLayout): void {
    this.selectedLayout.set(layout)
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onConfirm(): void {
    const layout = this.selectedLayout()
    if (layout) {
      this.dialogRef.close(layout)
    }
  }
}
