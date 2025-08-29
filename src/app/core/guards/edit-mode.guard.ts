import {inject} from '@angular/core'
import {Router, CanDeactivateFn} from '@angular/router'
import {Observable, of} from 'rxjs'
import {map, take, switchMap} from 'rxjs/operators'
import {Store} from '@ngrx/store'
import {MatDialog} from '@angular/material/dialog'

import {AppState} from '../../store'
import {selectEditMode} from '../../store/dashboard/dashboard.selectors'
import {
  ConfirmationModalComponent,
  ConfirmationModalData,
} from '../../shared/ui/confirmation-modal/confirmation-modal.component'
import * as DashboardActions from '../../store/dashboard/dashboard.actions'

export interface CanDeactivateComponent {
  canDeactivate?: () => Observable<boolean> | Promise<boolean> | boolean
}

export const editModeGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component
) => {
  const store = inject(Store<AppState>)
  const dialog = inject(MatDialog)

  return store.select(selectEditMode).pipe(
    take(1),
    switchMap((isEditMode) => {
      if (!isEditMode) {
        return of(true)
      }

      const confirmationData: ConfirmationModalData = {
        title: 'Unsaved Changes',
        message:
          'You have unsaved changes in edit mode. Do you want to discard these changes and continue?',
        confirmText: 'Discard Changes',
        cancelText: 'Stay in Edit Mode',
        isDestructive: true,
      }

      const dialogRef = dialog.open(ConfirmationModalComponent, {
        width: '400px',
        data: confirmationData,
        disableClose: true,
      })

      return dialogRef.afterClosed().pipe(
        map((result) => {
          if (result === true) {
            store.dispatch(DashboardActions.discardChanges())
            return true
          } else {
            return false
          }
        })
      )
    })
  )
}
