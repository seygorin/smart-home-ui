import {Component, Input, Output, EventEmitter} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state" [ngClass]="cssClass">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      @if (actionText && showAction) {
      <button
        mat-raised-button
        color="primary"
        class="empty-action"
        (click)="onAction()"
      >
        <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
        {{ actionText }}
      </button>
      }
    </div>
  `,
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() icon = 'inbox'
  @Input() title = ''
  @Input() message = ''
  @Input() actionText = ''
  @Input() actionIcon = ''
  @Input() showAction = true
  @Input() cssClass = ''

  @Output() action = new EventEmitter<void>()

  onAction(): void {
    this.action.emit()
  }
}
