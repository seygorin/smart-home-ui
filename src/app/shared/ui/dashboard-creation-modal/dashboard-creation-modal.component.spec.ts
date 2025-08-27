import {ComponentFixture, TestBed} from '@angular/core/testing'
import {ReactiveFormsModule} from '@angular/forms'
import {MatDialogRef} from '@angular/material/dialog'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'
import {Store} from '@ngrx/store'
import {of} from 'rxjs'

import {DashboardCreationModalComponent} from './dashboard-creation-modal.component'
import {DashboardService} from '../../../core/services/dashboard.service'
import {DashboardInfo} from '../../models'

describe('DashboardCreationModalComponent', () => {
  let component: DashboardCreationModalComponent
  let fixture: ComponentFixture<DashboardCreationModalComponent>
  let mockDialogRef: jasmine.SpyObj<
    MatDialogRef<DashboardCreationModalComponent>
  >
  let mockDashboardService: jasmine.SpyObj<DashboardService>
  let mockStore: jasmine.SpyObj<Store>

  const mockDashboards: DashboardInfo[] = [
    {id: 'existing-dashboard', title: 'Existing Dashboard', icon: 'home'},
  ]

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close'])
    mockDashboardService = jasmine.createSpyObj('DashboardService', [
      'getDashboards',
    ])
    mockStore = jasmine.createSpyObj('Store', ['dispatch'])

    mockDashboardService.getDashboards.and.returnValue(of(mockDashboards))

    await TestBed.configureTestingModule({
      imports: [
        DashboardCreationModalComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: DashboardService, useValue: mockDashboardService},
        {provide: Store, useValue: mockStore},
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DashboardCreationModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize form with empty values', () => {
    expect(component.dashboardForm.get('id')?.value).toBe('')
    expect(component.dashboardForm.get('title')?.value).toBe('')
    expect(component.dashboardForm.get('icon')?.value).toBe('')
  })

  it('should validate required fields', () => {
    const form = component.dashboardForm

    form.get('id')?.markAsTouched()
    form.get('title')?.markAsTouched()
    form.get('icon')?.markAsTouched()

    expect(form.get('id')?.hasError('required')).toBeTruthy()
    expect(form.get('title')?.hasError('required')).toBeTruthy()
    expect(form.get('icon')?.hasError('required')).toBeTruthy()
  })

  it('should validate maximum length', () => {
    const form = component.dashboardForm

    form.get('id')?.setValue('a'.repeat(31)) 
    form.get('title')?.setValue('a'.repeat(51)) 

    expect(form.get('id')?.hasError('maxLength')).toBeTruthy()
    expect(form.get('title')?.hasError('maxLength')).toBeTruthy()
  })

  it('should validate unique dashboard ID', async () => {
    await fixture.whenStable()

    const form = component.dashboardForm
    form.get('id')?.setValue('existing-dashboard')
    form.get('id')?.markAsTouched()

    expect(form.get('id')?.hasError('uniqueId')).toBeTruthy()
  })

  it('should close dialog on cancel', () => {
    component.onCancel()
    expect(mockDialogRef.close).toHaveBeenCalled()
  })

  it('should dispatch create action and close dialog on valid form submission', () => {
    const form = component.dashboardForm
    form.get('id')?.setValue('new-dashboard')
    form.get('title')?.setValue('New Dashboard')
    form.get('icon')?.setValue('home')

    component.onCreate()

    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: 'new-dashboard',
      title: 'New Dashboard',
      icon: 'home',
    })
  })

  it('should not submit invalid form', () => {
    component.onCreate()

    expect(mockStore.dispatch).not.toHaveBeenCalled()
    expect(mockDialogRef.close).not.toHaveBeenCalled()
  })

  it('should return correct field errors', () => {
    const form = component.dashboardForm
    form.get('id')?.markAsTouched()
    form.get('id')?.setValue('')

    expect(component.getFieldError('id')).toContain('required')
    expect(component.hasFieldError('id')).toBeTruthy()
  })
})
