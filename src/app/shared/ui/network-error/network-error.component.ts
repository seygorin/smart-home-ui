import {Component, Output, EventEmitter} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'

@Component({
  selector: 'app-network-error',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <mat-card class="network-error">
      <mat-card-content>
        <div class="network-error__icon">
          <mat-icon>wifi_off</mat-icon>
        </div>

        <div class="network-error__content">
          <h3 class="network-error__title">Connection Problem</h3>

          <p class="network-error__message">
            Unable to connect to the server. Please check your internet
            connection and try again.
          </p>

          <div class="network-error__troubleshooting">
            <h4>Troubleshooting steps:</h4>
            <ul>
              <li>Check your internet connection</li>
              <li>Verify the server is running</li>
              <li>Try refreshing the page</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>

          <div class="network-error__actions">
            <button mat-raised-button color="primary" (click)="onRetry()">
              <mat-icon>refresh</mat-icon>
              Try Again
            </button>

            <button mat-button (click)="onRefresh()">
              <mat-icon>refresh</mat-icon>
              Refresh Page
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .network-error {
        max-width: 500px;
        margin: 2rem auto;
        text-align: center;
      }

      .network-error__icon {
        margin-bottom: 1rem;
      }

      .network-error__icon mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: #f44336;
      }

      .network-error__title {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        font-weight: 500;
      }

      .network-error__message {
        margin: 0 0 1.5rem 0;
        color: rgba(0, 0, 0, 0.7);
        line-height: 1.5;
      }

      .network-error__troubleshooting {
        text-align: left;
        margin: 0 0 2rem 0;
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 4px;
      }

      .network-error__troubleshooting h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 500;
      }

      .network-error__troubleshooting ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .network-error__troubleshooting li {
        margin-bottom: 0.25rem;
        color: rgba(0, 0, 0, 0.7);
      }

      .network-error__actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .network-error__actions button {
        min-width: 120px;
      }
    `,
  ],
})
export class NetworkErrorComponent {
  @Output() retry = new EventEmitter<void>()
  @Output() refresh = new EventEmitter<void>()

  onRetry(): void {
    this.retry.emit()
  }

  onRefresh(): void {
    window.location.reload()
  }
}
