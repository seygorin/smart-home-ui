import {Component, Input} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-state" [ngClass]="cssClass">
      <mat-spinner
        [diameter]="diameter"
        [strokeWidth]="strokeWidth"
      ></mat-spinner>
      @if (message) {
      <p class="loading-message">{{ message }}</p>
      }
    </div>
  `,
  styleUrls: ['./loading-state.component.scss'],
})
export class LoadingStateComponent {
  @Input() message = ''
  @Input() diameter = 40
  @Input() strokeWidth = 4
  @Input() cssClass = ''
}
