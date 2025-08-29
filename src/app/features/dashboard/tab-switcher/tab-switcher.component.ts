import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  inject,
} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {MatTabsModule} from '@angular/material/tabs'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatTooltipModule} from '@angular/material/tooltip'
import {Tab} from '../../../shared/models/index'
import {MatTabChangeEvent} from '@angular/material/tabs'
import {DashboardValidationService} from '../../../shared/services/dashboard-validation.service'

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './tab-switcher.component.html',
  styleUrl: './tab-switcher.component.scss',
})
export class TabSwitcherComponent {
  private readonly validationService = inject(DashboardValidationService)

  @Input() tabs: Tab[] = []
  @Input() selectedTabId = ''
  @Input() editMode = false
  @Output() tabSelected = new EventEmitter<string>()
  @Output() tabAdded = new EventEmitter<string>()
  @Output() tabRemoved = new EventEmitter<string>()
  @Output() tabReordered = new EventEmitter<{
    tabId: string
    direction: 'left' | 'right'
  }>()
  @Output() tabRenamed = new EventEmitter<{tabId: string; title: string}>()

  editingTabId = signal<string | null>(null)
  editingTabTitle = signal('')
  newTabTitle = signal('')
  isAddingTab = signal(false)

  newTabError = signal<string | null>(null)
  editTabError = signal<string | null>(null)

  getSelectedIndex(): number {
    return this.tabs.findIndex((tab) => tab.id === this.selectedTabId)
  }

  onTabChange(event: MatTabChangeEvent): void {
    const selectedTab = this.tabs[event.index]
    if (selectedTab) {
      this.tabSelected.emit(selectedTab.id)
    }
  }

  addNewTab(): void {
    this.isAddingTab.set(true)
    this.newTabTitle.set('')
  }

  saveNewTab(): void {
    const title = this.newTabTitle().trim()
    if (!title) {
      this.newTabError.set('Tab title is required')
      return
    }

    const existingTitles = this.tabs.map((tab) => tab.title)
    this.validationService
      .validateTabForm({title}, existingTitles)
      .subscribe((result) => {
        if (result.isValid) {
          this.tabAdded.emit(title)
          this.isAddingTab.set(false)
          this.newTabTitle.set('')
          this.newTabError.set(null)
        } else {
          const titleError = result.errors.find(
            (error) => error.field === 'title'
          )
          this.newTabError.set(titleError?.message || 'Invalid tab title')
        }
      })
  }

  cancelNewTab(): void {
    this.isAddingTab.set(false)
    this.newTabTitle.set('')
    this.newTabError.set(null)
  }

  editTabTitle(tabId: string): void {
    const tab = this.tabs.find((t) => t.id === tabId)
    if (tab) {
      this.editingTabId.set(tabId)
      this.editingTabTitle.set(tab.title)
    }
  }

  saveTabTitle(tabId: string): void {
    const title = this.editingTabTitle().trim()
    const currentTab = this.tabs.find((t) => t.id === tabId)

    if (!title) {
      this.editTabError.set('Tab title is required')
      return
    }

    if (title === currentTab?.title) {
      this.editingTabId.set(null)
      this.editingTabTitle.set('')
      this.editTabError.set(null)
      return
    }

    const existingTitles = this.tabs.map((tab) => tab.title)
    this.validationService
      .validateTabForm({title}, existingTitles, currentTab?.title)
      .subscribe((result) => {
        if (result.isValid) {
          this.tabRenamed.emit({tabId, title})
          this.editingTabId.set(null)
          this.editingTabTitle.set('')
          this.editTabError.set(null)
        } else {
          const titleError = result.errors.find(
            (error) => error.field === 'title'
          )
          this.editTabError.set(titleError?.message || 'Invalid tab title')
        }
      })
  }

  cancelTabEdit(): void {
    this.editingTabId.set(null)
    this.editingTabTitle.set('')
    this.editTabError.set(null)
  }

  removeTab(tabId: string): void {
    this.tabRemoved.emit(tabId)
  }

  reorderTab(tabId: string, direction: 'left' | 'right'): void {
    this.tabReordered.emit({tabId, direction})
  }

  canMoveLeft(tabId: string): boolean {
    const index = this.tabs.findIndex((tab) => tab.id === tabId)
    return index > 0
  }

  canMoveRight(tabId: string): boolean {
    const index = this.tabs.findIndex((tab) => tab.id === tabId)
    return index < this.tabs.length - 1
  }

  onKeyDown(
    event: KeyboardEvent,
    action: 'saveNew' | 'cancelNew' | 'saveEdit' | 'cancelEdit',
    tabId?: string
  ): void {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (action === 'saveNew') {
        this.saveNewTab()
      } else if (action === 'saveEdit' && tabId) {
        this.saveTabTitle(tabId)
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      if (action === 'cancelNew') {
        this.cancelNewTab()
      } else if (action === 'cancelEdit') {
        this.cancelTabEdit()
      }
    }
  }

  onNewTabTitleChange(): void {
    if (this.newTabError()) {
      this.newTabError.set(null)
    }
  }

  onEditTabTitleChange(): void {
    if (this.editTabError()) {
      this.editTabError.set(null)
    }
  }

  isNewTabValid(): boolean {
    const title = this.newTabTitle().trim()
    return title.length > 0 && title.length <= 50 && !this.newTabError()
  }

  isEditTabValid(): boolean {
    const title = this.editingTabTitle().trim()
    return title.length > 0 && title.length <= 50 && !this.editTabError()
  }
}
