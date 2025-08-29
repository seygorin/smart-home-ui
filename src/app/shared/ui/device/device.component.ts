import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  computed,
  signal,
} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {Store} from '@ngrx/store'
import {Device} from '../../models/index'
import {ActiveHighlightDirective} from '../../directives/active-highlight.directive'
import {AppState} from '../../../store'
import * as DashboardActions from '../../../store/dashboard/dashboard.actions'
import {selectDeviceToggling} from '../../../store/dashboard/dashboard.selectors'

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ActiveHighlightDirective,
  ],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  private readonly store = inject(Store<AppState>)

  @Input() device!: Device
  @Input() isSingle = false
  @Output() stateChanged = new EventEmitter<Device>()

  isLoading = computed(() => {
    const deviceToggling = this.store.selectSignal(selectDeviceToggling)()
    return deviceToggling[this.device.id] || false
  })

  onToggle(change?: boolean): void {
    if (this.isLoading()) {
      return
    }

    const newState = change ?? !this.device.state

    this.store.dispatch(
      DashboardActions.toggleDeviceState({
        deviceId: this.device.id,
        newState,
      })
    )

    this.stateChanged.emit({...this.device, state: newState})
  }

  getIconColor(): string {
    return this.device.state ? 'primary' : 'grey'
  }
}
