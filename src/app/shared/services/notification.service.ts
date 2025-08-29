import {Injectable, inject} from '@angular/core'
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar'

export interface NotificationConfig extends MatSnackBarConfig {
  type?: 'success' | 'error' | 'warning' | 'info'
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar)

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  }

  success(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'success',
      panelClass: ['success-snackbar'],
    })
  }

  successWithAction(
    message: string,
    action: string,
    config?: NotificationConfig
  ): void {
    this.showWithAction(message, action, {
      ...config,
      type: 'success',
      panelClass: ['success-snackbar'],
    })
  }

  error(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'error',
      panelClass: ['error-snackbar'],
      duration: 7000, 
    })
  }

  warning(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'warning',
      panelClass: ['warning-snackbar'],
    })
  }

  info(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'info',
      panelClass: ['info-snackbar'],
    })
  }

  private show(message: string, config?: NotificationConfig): void {
    const finalConfig = {...this.defaultConfig, ...config}

    this.snackBar.open(message, 'Dismiss', finalConfig)
  }

  showWithAction(
    message: string,
    action: string,
    config?: NotificationConfig
  ): void {
    const finalConfig = {...this.defaultConfig, ...config}

    this.snackBar.open(message, action, finalConfig)
  }

  dismiss(): void {
    this.snackBar.dismiss()
  }
}
