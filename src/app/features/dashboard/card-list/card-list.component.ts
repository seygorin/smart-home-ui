import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardComponent],
  template: `
    <div class="card-grid">
      <app-card />
      <app-card />
    </div>
  `,
})
export class CardListComponent {}
