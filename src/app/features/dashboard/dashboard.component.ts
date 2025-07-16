import { Component } from '@angular/core';
import { TabSwitcherComponent } from './tab-switcher/tab-switcher.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TabSwitcherComponent],
  template: ` <app-tab-switcher /> `,
})
export class DashboardComponent {}
