import {Component, Input, Output, EventEmitter} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="error-state" [ngClass]="cssClass">
      <mat-icon class="error-icon">{{ icon }}</mat-icon>
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      @if (showRetry) {
      <button
        mat-raised-button
        color="primary"
        class="error-action"
        (click)="onRetry()"
      >
        <mat-icon>refresh</mat-icon>
        {{ retryText }}
      </button>
      } @if (showSecondaryAction && secondaryActionText) {
      <button
        mat-button
        class="error-secondary-action"
        (click)="onSecondaryAction()"
      >
        {{ secondaryActionText }}
      </button>
      }
    </div>
  `,
  styleUrls: ['./error-state.component.scss'],
})
export class ErrorStateComponent {
  @Input() icon = 'error_outline'
  @Input() title = 'Something went wrong'
  @Input() message = ''
  @Input() retryText = 'Retry'
  @Input() showRetry = true
  @Input() secondaryActionText = ''
  @Input() showSecondaryAction = false
  @Input() cssClass = ''

  @Output() retry = new EventEmitter<void>()
  @Output() secondaryAction = new EventEmitter<void>()

  onRetry(): void {
    this.retry.emit()
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit()
  }
}
