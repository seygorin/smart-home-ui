import {Component, inject, OnInit} from '@angular/core'
import {CommonModule} from '@angular/common'
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
} from '@angular/forms'
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {Store} from '@ngrx/store'
import {map} from 'rxjs/operators'

import {DashboardValidators} from '../../validators'
import {DashboardService} from '../../../core/services/dashboard.service'
import {CreateDashboardRequest} from '../../models'
import {createDashboard} from '../../../store/dashboard/dashboard.actions'

@Component({
  selector: 'app-dashboard-creation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dashboard-creation-modal.component.html',
  styleUrl: './dashboard-creation-modal.component.scss',
})
export class DashboardCreationModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly dialogRef = inject(
    MatDialogRef<DashboardCreationModalComponent>
  )
  private readonly dashboardService = inject(DashboardService)
  private readonly store = inject(Store)

  dashboardForm = this.fb.group({
    id: [
      '',
      [
        DashboardValidators.required('Dashboard ID'),
        DashboardValidators.maxLength(30, 'Dashboard ID'),
        DashboardValidators.dashboardIdFormat(),
        DashboardValidators.noWhitespaceOnly(),
      ],
    ],
    title: [
      '',
      [
        DashboardValidators.required('Title'),
        DashboardValidators.maxLength(50, 'Title'),
        DashboardValidators.noWhitespaceOnly(),
      ],
    ],
    icon: ['', [DashboardValidators.required('Icon')]],
  })

  iconOptions = [
    {value: 'home', label: 'Home', icon: 'home'},
    {value: 'dashboard', label: 'Dashboard', icon: 'dashboard'},
    {value: 'devices', label: 'Devices', icon: 'devices'},
    {value: 'settings', label: 'Settings', icon: 'settings'},
    {value: 'favorite', label: 'Favorite', icon: 'favorite'},
    {value: 'star', label: 'Star', icon: 'star'},
    {value: 'work', label: 'Work', icon: 'work'},
    {value: 'folder', label: 'Folder', icon: 'folder'},
  ]

  ngOnInit(): void {
    this.dashboardService
      .getDashboards()
      .pipe(map((dashboards) => dashboards.map((d) => d.id)))
      .subscribe((existingIds) => {
        const idControl = this.dashboardForm.get('id')
        if (idControl) {
          const validators: ValidatorFn[] = [
            DashboardValidators.required('Dashboard ID'),
            DashboardValidators.maxLength(30, 'Dashboard ID'),
            DashboardValidators.dashboardIdFormat(),
            DashboardValidators.noWhitespaceOnly(),
            DashboardValidators.uniqueId(existingIds),
          ]

          idControl.setValidators(validators)
          idControl.updateValueAndValidity()
        }
      })
  }

  getFieldError(fieldName: string): string | null {
    const field = this.dashboardForm.get(fieldName)
    if (!field || !field.errors || !field.touched) {
      return null
    }

    const errors = field.errors

    if (errors['required']) {
      return errors['required'].message || `${fieldName} is required`
    }

    if (errors['maxLength']) {
      return errors['maxLength'].message || `${fieldName} is too long`
    }

    if (errors['uniqueId']) {
      return 'Dashboard ID already exists'
    }

    if (errors['dashboardIdFormat']) {
      return (
        errors['dashboardIdFormat'].message || 'Invalid dashboard ID format'
      )
    }

    if (errors['whitespaceOnly']) {
      return errors['whitespaceOnly'].message || 'Field cannot be empty'
    }

    return 'Invalid input'
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.dashboardForm.get(fieldName)
    return !!(field && field.errors && field.touched)
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onCreate(): void {
    if (this.dashboardForm.valid) {
      const formValue = this.dashboardForm.value
      const dashboard: CreateDashboardRequest = {
        id: formValue.id!.trim(),
        title: formValue.title!.trim(),
        icon: formValue.icon!,
      }

      this.store.dispatch(createDashboard({dashboard}))
      this.dialogRef.close(dashboard)
    } else {
      Object.keys(this.dashboardForm.controls).forEach((key) => {
        const control = this.dashboardForm.get(key)
        if (control) {
          control.markAsTouched()
        }
      })
    }
  }
}
