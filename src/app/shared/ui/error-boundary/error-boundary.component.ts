import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import {Router} from '@angular/router'

import {
  ErrorHandlerService,
  AppError,
} from '../../../core/services/error-handler.service'

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <mat-card class="error-boundary">
      <mat-card-content>
        <div class="error-boundary__icon">
          <mat-icon>error_outline</mat-icon>
        </div>

        <div class="error-boundary__content">
          <h2 class="error-boundary__title">Something went wrong</h2>

          <p class="error-boundary__message">
            {{
              error?.userMessage ||
                'An unexpected error occurred. Please try refreshing the page.'
            }}
          </p>

          @if (showDetails && error) {
          <details class="error-boundary__details">
            <summary>Technical Details</summary>
            <div class="error-boundary__technical">
              <p><strong>Error:</strong> {{ error.technicalMessage }}</p>
              <p>
                <strong>Time:</strong> {{ error.timestamp | date : 'medium' }}
              </p>
              @if (error.errorCode) {
              <p><strong>Code:</strong> {{ error.errorCode }}</p>
              } @if (error.requestUrl) {
              <p>
                <strong>URL:</strong> {{ error.requestMethod }}
                {{ error.requestUrl }}
              </p>
              }
            </div>
          </details>
          }

          <div class="error-boundary__actions">
            <button mat-raised-button color="primary" (click)="onRefresh()">
              <mat-icon>refresh</mat-icon>
              Refresh Page
            </button>

            <button mat-button (click)="onGoHome()">
              <mat-icon>home</mat-icon>
              Go to Home
            </button>

            <button mat-button (click)="onReportError()">
              <mat-icon>bug_report</mat-icon>
              Report Issue
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .error-boundary {
        max-width: 600px;
        margin: 2rem auto;
        text-align: center;
      }

      .error-boundary__icon {
        margin-bottom: 1rem;
      }

      .error-boundary__icon mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: #f44336;
      }

      .error-boundary__title {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }

      .error-boundary__message {
        margin: 0 0 1.5rem 0;
        color: rgba(0, 0, 0, 0.6);
        line-height: 1.5;
      }

      .error-boundary__details {
        text-align: left;
        margin: 1rem 0 2rem 0;
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
      }

      .error-boundary__details summary {
        cursor: pointer;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      .error-boundary__technical {
        font-family: monospace;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.7);
      }

      .error-boundary__technical p {
        margin: 0.25rem 0;
        word-break: break-all;
      }

      .error-boundary__actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .error-boundary__actions button {
        min-width: 120px;
      }
    `,
  ],
})
export class ErrorBoundaryComponent implements OnInit {
  @Input() error: AppError | null = null
  @Input() showDetails = false
  @Output() refresh = new EventEmitter<void>()
  @Output() goHome = new EventEmitter<void>()
  @Output() reportError = new EventEmitter<AppError>()

  private router = inject(Router)
  private errorHandlerService = inject(ErrorHandlerService)

  ngOnInit(): void {
    if (!this.error) {
      this.error = this.errorHandlerService.handleGenericError(
        new Error('Unknown error occurred')
      )
    }
  }

  onRefresh(): void {
    if (this.refresh.observers.length > 0) {
      this.refresh.emit()
    } else {
      window.location.reload()
    }
  }

  onGoHome(): void {
    if (this.goHome.observers.length > 0) {
      this.goHome.emit()
    } else {
      this.router.navigate(['/'])
    }
  }

  onReportError(): void {
    if (this.error && this.reportError.observers.length > 0) {
      this.reportError.emit(this.error)
    } else {
      this.copyErrorToClipboard()
    }
  }

  private copyErrorToClipboard(): void {
    if (!this.error) return

    const errorDetails = `
Error Report:
- Message: ${this.error.userMessage}
- Technical: ${this.error.technicalMessage}
- Code: ${this.error.errorCode || 'N/A'}
- Time: ${this.error.timestamp}
- URL: ${this.error.requestMethod || ''} ${this.error.requestUrl || ''}
- User Agent: ${navigator.userAgent}
    `.trim()

    navigator.clipboard
      .writeText(errorDetails)
      .then(() => {
        alert(
          'Error details copied to clipboard. Please share this with support.'
        )
      })
      .catch(() => {
        console.error('Failed to copy error details to clipboard')
      })
  }
}
