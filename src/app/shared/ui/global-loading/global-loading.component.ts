import {Component, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LoadingService} from '../../services/loading.service'
import {LoadingIndicatorComponent} from '../loading-indicator/loading-indicator.component'

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent],
  template: `
    @if (loadingService.isAnyLoading()) {
    <app-loading-indicator
      type="overlay"
      [message]="getCurrentLoadingMessage()"
    ></app-loading-indicator>
    }
  `,
})
export class GlobalLoadingComponent {
  loadingService = inject(LoadingService)

  getCurrentLoadingMessage(): string {
    const loadingState = this.loadingService.loadingSignal()

    if (loadingState['createDashboard']) {
      return 'Creating dashboard...'
    }
    if (loadingState['deleteDashboard']) {
      return 'Deleting dashboard...'
    }
    if (loadingState['saveDashboard']) {
      return 'Saving dashboard...'
    }
    if (loadingState['loadDashboard']) {
      return 'Loading dashboard...'
    }
    if (loadingState['loadDevices']) {
      return 'Loading devices...'
    }

    const deviceToggleKey = Object.keys(loadingState).find(
      (key) => key.startsWith('toggleDevice_') && loadingState[key]
    )
    if (deviceToggleKey) {
      return 'Updating device...'
    }

    return 'Loading...'
  }
}
