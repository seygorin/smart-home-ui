import {Injectable, ErrorHandler, inject} from '@angular/core'
import {NotificationService} from '../../shared/services/notification.service'
import {ErrorHandlerService} from './error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService = inject(NotificationService)
  private errorHandlerService = inject(ErrorHandlerService)

  handleError(error: any): void {
    const handledError = this.errorHandlerService.handleGenericError(error)

    this.notificationService.error(handledError.userMessage, {
      duration: 7000,
    })

    console.error('Global Error Handler:', handledError)

    if (this.isProduction()) {
      this.sendToLoggingService(handledError)
    }
  }

  private isProduction(): boolean {
    return !!(window as any)['production'] || location.hostname !== 'localhost'
  }

  private sendToLoggingService(error: any): void {
    console.log('Would send to logging service:', error)
  }
}
