import { Component } from '@angular/core';
import { mockData } from '../../core/mock-data';
import { Tab, Card } from '../../shared/models';
import { TabSwitcherComponent } from './tab-switcher/tab-switcher.component';
import { CardListComponent } from '../../shared/ui/card-list/card-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TabSwitcherComponent, CardListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  tabs: Tab[] = mockData;
  selectedTabId: string = this.tabs[0]?.id || 'overview';
  selectedCards: Card[] = this.getCardsForTab(this.selectedTabId);

  onTabSelected(tabId: string): void {
    this.selectedTabId = tabId;
    this.selectedCards = this.getCardsForTab(tabId);
  }

  private getCardsForTab(tabId: string): Card[] {
    return this.tabs.find((tab) => tab.id === tabId)?.cards || [];
  }
}
