import {Component, Input} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatProgressBarModule} from '@angular/material/progress-bar'

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
  template: `
    <div class="loading-indicator" [ngClass]="'loading-indicator--' + type">
      @if (type === 'spinner') {
      <div class="loading-indicator__spinner">
        <mat-spinner
          [diameter]="size"
          [strokeWidth]="strokeWidth"
        ></mat-spinner>
        @if (message) {
        <p class="loading-indicator__message">{{ message }}</p>
        }
      </div>
      } @if (type === 'bar') {
      <div class="loading-indicator__bar">
        @if (message) {
        <p class="loading-indicator__message">{{ message }}</p>
        }
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
      } @if (type === 'overlay') {
      <div class="loading-indicator__overlay">
        <div class="loading-indicator__overlay-content">
          <mat-spinner
            [diameter]="size"
            [strokeWidth]="strokeWidth"
          ></mat-spinner>
          @if (message) {
          <p class="loading-indicator__message">{{ message }}</p>
          }
        </div>
      </div>
      } @if (type === 'inline') {
      <div class="loading-indicator__inline">
        <mat-spinner
          [diameter]="size"
          [strokeWidth]="strokeWidth"
        ></mat-spinner>
        @if (message) {
        <span class="loading-indicator__message">{{ message }}</span>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .loading-indicator__spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .loading-indicator__bar {
        width: 100%;
      }

      .loading-indicator__bar .loading-indicator__message {
        margin: 0 0 0.5rem 0;
        text-align: center;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .loading-indicator__overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .loading-indicator__overlay-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .loading-indicator__inline {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .loading-indicator__message {
        margin: 0;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .loading-indicator--inline .loading-indicator__message {
        font-size: 0.75rem;
      }
    `,
  ],
})
export class LoadingIndicatorComponent {
  @Input() type: 'spinner' | 'bar' | 'overlay' | 'inline' = 'spinner'
  @Input() message?: string
  @Input() size = 40
  @Input() strokeWidth = 4
}
