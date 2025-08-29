import {ComponentFixture, TestBed} from '@angular/core/testing'
import {MatDialogRef} from '@angular/material/dialog'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'

import {CardLayoutModalComponent} from './card-layout-modal.component'
import {CardLayout} from '../../models'

describe('CardLayoutModalComponent', () => {
  let component: CardLayoutModalComponent
  let fixture: ComponentFixture<CardLayoutModalComponent>
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CardLayoutModalComponent>>

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close'])

    await TestBed.configureTestingModule({
      imports: [CardLayoutModalComponent, NoopAnimationsModule],
      providers: [{provide: MatDialogRef, useValue: mockDialogRef}],
    }).compileComponents()

    fixture = TestBed.createComponent(CardLayoutModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with no layout selected', () => {
    expect(component.selectedLayout()).toBeNull()
  })

  it('should have three layout options', () => {
    expect(component.layoutOptions).toHaveSize(3)
    expect(component.layoutOptions.map((o) => o.value)).toEqual([
      'singleDevice',
      'horizontalLayout',
      'verticalLayout',
    ])
  })

  it('should select layout when selectLayout is called', () => {
    const layout: CardLayout = 'horizontalLayout'

    component.selectLayout(layout)

    expect(component.selectedLayout()).toBe(layout)
  })

  it('should close dialog without result when cancel is clicked', () => {
    component.onCancel()

    expect(mockDialogRef.close).toHaveBeenCalledWith()
  })

  it('should close dialog with selected layout when confirm is clicked', () => {
    const layout: CardLayout = 'verticalLayout'
    component.selectLayout(layout)

    component.onConfirm()

    expect(mockDialogRef.close).toHaveBeenCalledWith(layout)
  })

  it('should not close dialog with result when confirm is clicked without selection', () => {
    component.onConfirm()

    expect(mockDialogRef.close).not.toHaveBeenCalled()
  })

  it('should display layout options in template', () => {
    const compiled = fixture.nativeElement as HTMLElement
    const layoutOptions = compiled.querySelectorAll('.layout-option')

    expect(layoutOptions).toHaveSize(3)
  })

  it('should show selected state when layout is selected', () => {
    component.selectLayout('singleDevice')
    fixture.detectChanges()

    const compiled = fixture.nativeElement as HTMLElement
    const selectedOption = compiled.querySelector('.layout-option.selected')

    expect(selectedOption).toBeTruthy()
  })

  it('should disable confirm button when no layout is selected', () => {
    const compiled = fixture.nativeElement as HTMLElement
    const confirmButton = compiled.querySelector(
      'button[color="primary"]'
    ) as HTMLButtonElement

    expect(confirmButton.disabled).toBeTruthy()
  })

  it('should enable confirm button when layout is selected', () => {
    component.selectLayout('singleDevice')
    fixture.detectChanges()

    const compiled = fixture.nativeElement as HTMLElement
    const confirmButton = compiled.querySelector(
      'button[color="primary"]'
    ) as HTMLButtonElement

    expect(confirmButton.disabled).toBeFalsy()
  })
})
