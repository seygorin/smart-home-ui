import {Component, EventEmitter, Input, Output} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatTabsModule} from '@angular/material/tabs'
import {Tab} from '../../../shared/models/index'
import {MatTabChangeEvent} from '@angular/material/tabs'

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './tab-switcher.component.html',
  styleUrl: './tab-switcher.component.scss',
})
export class TabSwitcherComponent {
  @Input() tabs: Tab[] = []
  @Input() selectedTabId = ''
  @Output() tabSelected = new EventEmitter<string>()

  getSelectedIndex(): number {
    return this.tabs.findIndex((tab) => tab.id === this.selectedTabId)
  }

  onTabChange(event: MatTabChangeEvent): void {
    const selectedTab = this.tabs[event.index]
    if (selectedTab) {
      this.tabSelected.emit(selectedTab.id)
    }
  }
}
