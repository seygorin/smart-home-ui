import {Component, Input, Output, EventEmitter} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'

@Component({
  selector: 'app-loading-error',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="loading-error">
      <div class="loading-error__icon">
        <mat-icon>error_outline</mat-icon>
      </div>

      <div class="loading-error__content">
        <h3 class="loading-error__title">{{ title }}</h3>

        <p class="loading-error__message">{{ message }}</p>

        <div class="loading-error__actions">
          <button
            mat-raised-button
            color="primary"
            (click)="onRetry()"
            [disabled]="retrying"
          >
            <mat-icon>{{ retrying ? 'hourglass_empty' : 'refresh' }}</mat-icon>
            {{ retrying ? 'Retrying...' : 'Try Again' }}
          </button>

          <button *ngIf="showGoBack" mat-button (click)="onGoBack()">
            <mat-icon>arrow_back</mat-icon>
            Go Back
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
        min-height: 200px;
      }

      .loading-error__icon {
        margin-bottom: 1rem;
      }

      .loading-error__icon mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #f44336;
      }

      .loading-error__title {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }

      .loading-error__message {
        margin: 0 0 1.5rem 0;
        color: rgba(0, 0, 0, 0.6);
        line-height: 1.4;
        max-width: 400px;
      }

      .loading-error__actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .loading-error__actions button {
        min-width: 100px;
      }
    `,
  ],
})
export class LoadingErrorComponent {
  @Input() title = 'Failed to Load'
  @Input() message = 'Something went wrong while loading the data.'
  @Input() showGoBack = false
  @Input() retrying = false

  @Output() retry = new EventEmitter<void>()
  @Output() goBack = new EventEmitter<void>()

  onRetry(): void {
    this.retry.emit()
  }

  onGoBack(): void {
    this.goBack.emit()
  }
}
