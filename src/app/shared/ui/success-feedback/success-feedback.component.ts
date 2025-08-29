import {Component, Input, Output, EventEmitter} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'

export interface SuccessFeedbackConfig {
  title?: string
  message: string
  icon?: string
  showContinue?: boolean
  showGoBack?: boolean
  continueText?: string
  goBackText?: string
}

@Component({
  selector: 'app-success-feedback',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="success-feedback">
      <div class="success-feedback__icon">
        <mat-icon>{{ config.icon || 'check_circle' }}</mat-icon>
      </div>

      <div class="success-feedback__content">
        <h3 class="success-feedback__title">
          {{ config.title || 'Success!' }}
        </h3>

        <p class="success-feedback__message">{{ config.message }}</p>

        <div class="success-feedback__actions">
          <button
            *ngIf="config.showContinue"
            mat-raised-button
            color="primary"
            (click)="onContinue()"
          >
            {{ config.continueText || 'Continue' }}
          </button>

          <button *ngIf="config.showGoBack" mat-button (click)="onGoBack()">
            {{ config.goBackText || 'Go Back' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .success-feedback {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
        min-height: 200px;
      }

      .success-feedback__icon {
        margin-bottom: 1rem;
      }

      .success-feedback__icon mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: #4caf50;
      }

      .success-feedback__title {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }

      .success-feedback__message {
        margin: 0 0 1.5rem 0;
        color: rgba(0, 0, 0, 0.6);
        line-height: 1.4;
        max-width: 400px;
      }

      .success-feedback__actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .success-feedback__actions button {
        min-width: 100px;
      }
    `,
  ],
})
export class SuccessFeedbackComponent {
  @Input() config!: SuccessFeedbackConfig
  @Output() continue = new EventEmitter<void>()
  @Output() goBack = new EventEmitter<void>()

  onContinue(): void {
    this.continue.emit()
  }

  onGoBack(): void {
    this.goBack.emit()
  }
}
