import {Component, Input, Output, EventEmitter} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'

export interface ErrorDisplayConfig {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  showRetry?: boolean
  showRefresh?: boolean
  showGoHome?: boolean
  icon?: string
}

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <mat-card class="error-display" [ngClass]="'error-display--' + config.type">
      <mat-card-content>
        <div class="error-display__icon">
          <mat-icon>{{ config.icon || getDefaultIcon() }}</mat-icon>
        </div>

        <div class="error-display__content">
          <h3 class="error-display__title">
            {{ config.title || getDefaultTitle() }}
          </h3>

          <p class="error-display__message">
            {{ config.message }}
          </p>

          <div class="error-display__actions">
            <button
              *ngIf="config.showRetry"
              mat-raised-button
              color="primary"
              (click)="onRetry()"
            >
              <mat-icon>refresh</mat-icon>
              Try Again
            </button>

            <button
              *ngIf="config.showRefresh"
              mat-raised-button
              color="primary"
              (click)="onRefresh()"
            >
              <mat-icon>refresh</mat-icon>
              Refresh Page
            </button>

            <button *ngIf="config.showGoHome" mat-button (click)="onGoHome()">
              <mat-icon>home</mat-icon>
              Go to Home
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .error-display {
        max-width: 500px;
        margin: 2rem auto;
        text-align: center;
      }

      .error-display__icon {
        margin-bottom: 1rem;
      }

      .error-display__icon mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
      }

      .error-display--error .error-display__icon mat-icon {
        color: #f44336;
      }

      .error-display--warning .error-display__icon mat-icon {
        color: #ff9800;
      }

      .error-display--info .error-display__icon mat-icon {
        color: #2196f3;
      }

      .error-display__title {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        font-weight: 500;
      }

      .error-display__message {
        margin: 0 0 2rem 0;
        color: rgba(0, 0, 0, 0.7);
        line-height: 1.5;
      }

      .error-display__actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .error-display__actions button {
        min-width: 120px;
      }
    `,
  ],
})
export class ErrorDisplayComponent {
  @Input() config!: ErrorDisplayConfig
  @Output() retry = new EventEmitter<void>()
  @Output() refresh = new EventEmitter<void>()
  @Output() goHome = new EventEmitter<void>()

  getDefaultIcon(): string {
    switch (this.config.type) {
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'error'
    }
  }

  getDefaultTitle(): string {
    switch (this.config.type) {
      case 'warning':
        return 'Warning'
      case 'info':
        return 'Information'
      default:
        return 'Error'
    }
  }

  onRetry(): void {
    this.retry.emit()
  }

  onRefresh(): void {
    this.refresh.emit()
  }

  onGoHome(): void {
    this.goHome.emit()
  }
}
