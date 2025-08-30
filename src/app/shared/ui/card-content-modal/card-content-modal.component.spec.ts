import {ComponentFixture, TestBed} from '@angular/core/testing'
import {ReactiveFormsModule} from '@angular/forms'
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import {MatDialogModule} from '@angular/material/dialog'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import {MatListModule} from '@angular/material/list'
import {MatDividerModule} from '@angular/material/divider'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {Store} from '@ngrx/store'
import {of} from 'rxjs'

import {
  CardContentModalComponent,
  CardContentModalData,
} from './card-content-modal.component'
import {Card, DeviceItem, SensorItem} from '../../models'

describe('CardContentModalComponent', () => {
  let component: CardContentModalComponent
  let fixture: ComponentFixture<CardContentModalComponent>
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CardContentModalComponent>>
  let mockStore: jasmine.SpyObj<Store>

  const mockCard: Card = {
    id: 'card-1',
    title: 'Test Card',
    layout: 'singleDevice',
    items: [
      {
        id: 'device-1',
        type: 'device',
        icon: 'lightbulb',
        label: 'Living Room Light',
        state: true,
      } as DeviceItem,
    ],
  }

  const mockDialogData: CardContentModalData = {
    card: mockCard,
    tabId: 'tab-1',
  }

  const mockAvailableDevices = [
    {
      id: 'device-1',
      type: 'device',
      icon: 'lightbulb',
      label: 'Living Room Light',
      state: true,
    } as DeviceItem,
    {
      id: 'sensor-1',
      type: 'sensor',
      icon: 'thermostat',
      label: 'Temperature Sensor',
      value: {amount: 22, unit: '°C'},
    } as SensorItem,
  ]

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close'])
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch'])
    mockStore.select.and.returnValue(of(mockAvailableDevices))

    await TestBed.configureTestingModule({
      imports: [
        CardContentModalComponent,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatListModule,
        MatDividerModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: mockDialogData},
        {provide: Store, useValue: mockStore},
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CardContentModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with card data', () => {
    expect(component.cardForm.get('title')?.value).toBe('Test Card')
    expect(component.cardItems()).toEqual(mockCard.items)
  })

  it('should dispatch loadDevices on init', () => {
    expect(mockStore.dispatch).toHaveBeenCalled()
  })

  it('should add entity to card items', () => {
    component.cardForm.get('selectedEntity')?.setValue('sensor-1')
    component.onAddEntity()

    const items = component.cardItems()
    expect(items.length).toBe(2)
    expect(items[1].id).toBe('sensor-1')
  })

  it('should remove entity from card items', () => {
    const initialLength = component.cardItems().length
    component.onRemoveEntity('device-1', 0)

    expect(component.cardItems().length).toBe(initialLength - 1)
  })

  it('should close dialog on cancel', () => {
    component.onCancel()
    expect(mockDialogRef.close).toHaveBeenCalledWith()
  })

  it('should close dialog with result on save', () => {
    const expectedResult = {
      title: 'Test Card',
      items: mockCard.items,
    }

    component.onSave()
    expect(mockDialogRef.close).toHaveBeenCalledWith(expectedResult)
  })

  it('should return correct entity icon', () => {
    const device = mockAvailableDevices[0]
    expect(component.getEntityIcon(device)).toBe('lightbulb')
  })

  it('should return correct entity label', () => {
    const device = mockAvailableDevices[0]
    expect(component.getEntityLabel(device)).toBe('Living Room Light')
  })

  it('should return correct entity value for device', () => {
    const device = mockAvailableDevices[0] as DeviceItem
    expect(component.getEntityValue(device)).toBe('On')
  })

  it('should return correct entity value for sensor', () => {
    const sensor = mockAvailableDevices[1] as SensorItem
    expect(component.getEntityValue(sensor)).toBe('22 °C')
  })

  it('should return correct entity type', () => {
    const device = mockAvailableDevices[0]
    const sensor = mockAvailableDevices[1]
    expect(component.getEntityType(device)).toBe('Device')
    expect(component.getEntityType(sensor)).toBe('Sensor')
  })

  it('should validate form correctly', () => {
    expect(component.isFormValid()).toBe(true)

    component.cardForm.get('title')?.setValue('a'.repeat(51))
    expect(component.isFormValid()).toBe(false)
  })

  it('should check if has items correctly', () => {
    expect(component.hasItems()).toBe(true)

    component.cardItems.set([])
    expect(component.hasItems()).toBe(false)
  })
})
