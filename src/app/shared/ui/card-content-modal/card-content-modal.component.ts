import {Component, inject, signal, OnInit, Inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import {MatListModule} from '@angular/material/list'
import {MatDividerModule} from '@angular/material/divider'
import {Store} from '@ngrx/store'

import {Card, CardItem, DeviceItem, SensorItem} from '../../models'
import {selectAvailableDevices} from '../../../store/dashboard/dashboard.selectors'
import {loadDevices} from '../../../store/dashboard/dashboard.actions'

export interface CardContentModalData {
  card: Card
  tabId: string
}

export interface CardContentModalResult {
  title?: string
  items: CardItem[]
}

@Component({
  selector: 'app-card-content-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './card-content-modal.component.html',
  styleUrl: './card-content-modal.component.scss',
})
export class CardContentModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CardContentModalComponent>)
  private readonly fb = inject(FormBuilder)
  private readonly store = inject(Store)

  cardForm: FormGroup
  cardItems = signal<CardItem[]>([])
  availableDevices$ = this.store.select(selectAvailableDevices)
  selectedEntityId = signal<string | null>(null)

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardContentModalData) {
    this.cardForm = this.fb.group({
      title: [this.data.card.title || '', [Validators.maxLength(50)]],
      selectedEntity: [''],
    })

    this.cardItems.set([...this.data.card.items])
  }

  ngOnInit(): void {
    this.store.dispatch(loadDevices())
  }

  onAddEntity(): void {
    const selectedEntityId = this.cardForm.get('selectedEntity')?.value
    if (!selectedEntityId) return

    this.availableDevices$
      .subscribe((devices) => {
        const selectedEntity = devices.find(
          (device) => device.id === selectedEntityId
        )
        if (selectedEntity) {
          const currentItems = this.cardItems()
          this.cardItems.set([...currentItems, selectedEntity])

          this.cardForm.get('selectedEntity')?.setValue('')
        }
      })
      .unsubscribe()
  }

  onRemoveEntity(itemId: string, index: number): void {
    const currentItems = this.cardItems()
    const updatedItems = currentItems.filter((_, i) => i !== index)
    this.cardItems.set(updatedItems)
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSave(): void {
    const result: CardContentModalResult = {
      title: this.cardForm.get('title')?.value?.trim() || undefined,
      items: this.cardItems(),
    }
    this.dialogRef.close(result)
  }

  getEntityIcon(item: CardItem): string {
    return item.icon
  }

  getEntityLabel(item: CardItem): string {
    return item.label
  }

  getEntityValue(item: CardItem): string {
    if (item.type === 'device') {
      return (item as DeviceItem).state ? 'On' : 'Off'
    } else if (item.type === 'sensor') {
      const sensor = item as SensorItem
      return `${sensor.value.amount} ${sensor.value.unit}`
    }
    return ''
  }

  getEntityType(item: CardItem): string {
    return item.type === 'device' ? 'Device' : 'Sensor'
  }

  hasItems(): boolean {
    return this.cardItems().length > 0
  }

  isFormValid(): boolean {
    return this.cardForm.valid
  }
}
