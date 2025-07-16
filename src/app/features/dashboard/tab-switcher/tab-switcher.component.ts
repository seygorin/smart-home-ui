import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CardListComponent } from '../../../shared/ui/card-list/card-list.component';

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [MatTabsModule, CardListComponent],
  template: `
    <mat-tab-group>
      <mat-tab label="Overview">
        <app-card-list />
      </mat-tab>
      <mat-tab label="Lights">
        <app-card-list />
      </mat-tab>
    </mat-tab-group>
  `,
})
export class TabSwitcherComponent {}
