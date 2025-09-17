import {ComponentFixture, TestBed} from '@angular/core/testing'
import {provideMockStore, MockStore} from '@ngrx/store/testing'
import {Device} from '../../models'
import {DeviceComponent} from './device.component'

describe('DeviceComponent', () => {
  let component: DeviceComponent
  let fixture: ComponentFixture<DeviceComponent>
  let store: MockStore

  const mockDevice: Device = {
    id: 'test-device-1',
    type: 'device',
    icon: 'lightbulb',
    label: 'Test Light',
    state: false,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceComponent],
      providers: [
        provideMockStore({
          initialState: {
            dashboard: {
              loading: {
                deviceToggling: {},
              },
            },
          },
        }),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)

    component.device = mockDevice

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should dispatch toggleDeviceState action on toggle', () => {
    spyOn(store, 'dispatch')

    component.onToggle(true)

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Dashboard] Toggle Device State',
        deviceId: 'test-device-1',
        newState: true,
      })
    )
  })

})
