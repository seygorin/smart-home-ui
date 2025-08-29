import {Injectable} from '@angular/core'
import {HttpErrorResponse, HttpRequest} from '@angular/common/http'

export interface AppError {
  originalError: HttpErrorResponse
  userMessage: string
  technicalMessage: string
  errorCode?: string
  timestamp: Date
  requestUrl?: string
  requestMethod?: string
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handleHttpError(
    error: HttpErrorResponse,
    request?: HttpRequest<any>
  ): AppError {
    const timestamp = new Date()
    const requestUrl = request?.url
    const requestMethod = request?.method

    console.error('HTTP Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: requestUrl,
      method: requestMethod,
      error: error.error,
      message: error.message,
      timestamp,
    })

    let userMessage: string
    let technicalMessage: string
    let errorCode: string | undefined

    switch (error.status) {
      case 0:
        userMessage =
          'Unable to connect to the server. Please check your internet connection.'
        technicalMessage = 'Network error or CORS issue'
        errorCode = 'NETWORK_ERROR'
        break

      case 400:
        userMessage =
          this.extractUserMessage(error) ||
          'Invalid request. Please check your input.'
        technicalMessage = error.message || 'Bad Request'
        errorCode = 'BAD_REQUEST'
        break

      case 401:
        userMessage = 'Your session has expired. Please log in again.'
        technicalMessage = 'Unauthorized access'
        errorCode = 'UNAUTHORIZED'
        break

      case 403:
        userMessage = 'You do not have permission to perform this action.'
        technicalMessage = 'Forbidden access'
        errorCode = 'FORBIDDEN'
        break

      case 404:
        userMessage = this.getNotFoundMessage(requestUrl)
        technicalMessage = 'Resource not found'
        errorCode = 'NOT_FOUND'
        break

      case 409:
        userMessage =
          this.extractUserMessage(error) ||
          'A conflict occurred. The resource may have been modified by another user.'
        technicalMessage = 'Conflict error'
        errorCode = 'CONFLICT'
        break

      case 422:
        userMessage =
          this.extractUserMessage(error) || 'The data provided is invalid.'
        technicalMessage = 'Validation error'
        errorCode = 'VALIDATION_ERROR'
        break

      case 429:
        userMessage =
          'Too many requests. Please wait a moment before trying again.'
        technicalMessage = 'Rate limit exceeded'
        errorCode = 'RATE_LIMIT'
        break

      case 500:
        userMessage =
          'An internal server error occurred. Please try again later.'
        technicalMessage = 'Internal server error'
        errorCode = 'INTERNAL_ERROR'
        break

      case 502:
        userMessage =
          'The server is temporarily unavailable. Please try again later.'
        technicalMessage = 'Bad gateway'
        errorCode = 'BAD_GATEWAY'
        break

      case 503:
        userMessage =
          'The service is temporarily unavailable. Please try again later.'
        technicalMessage = 'Service unavailable'
        errorCode = 'SERVICE_UNAVAILABLE'
        break

      case 504:
        userMessage = 'The request timed out. Please try again.'
        technicalMessage = 'Gateway timeout'
        errorCode = 'TIMEOUT'
        break

      default:
        userMessage = 'An unexpected error occurred. Please try again.'
        technicalMessage = error.message || `HTTP ${error.status} error`
        errorCode = 'UNKNOWN_ERROR'
        break
    }

    return {
      originalError: error,
      userMessage,
      technicalMessage,
      errorCode,
      timestamp,
      requestUrl,
      requestMethod,
    }
  }

  private extractUserMessage(error: HttpErrorResponse): string | null {
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error
      }
      if (error.error.message) {
        return error.error.message
      }
      if (error.error.error) {
        return error.error.error
      }
      if (error.error.details) {
        return error.error.details
      }
    }
    return null
  }

  private getNotFoundMessage(url?: string): string {
    if (!url) {
      return 'The requested resource was not found.'
    }

    if (url.includes('/dashboards/')) {
      return 'The requested dashboard was not found.'
    }
    if (url.includes('/devices/')) {
      return 'The requested device was not found.'
    }
    if (url.includes('/api/')) {
      return 'The requested resource was not found.'
    }

    return 'The requested resource was not found.'
  }

  handleGenericError(error: any): AppError {
    const timestamp = new Date()

    console.error('Generic Error:', error)

    let userMessage: string
    let technicalMessage: string

    if (error instanceof Error) {
      technicalMessage = error.message
      userMessage =
        'An unexpected error occurred. Please refresh the page and try again.'
    } else {
      technicalMessage = String(error)
      userMessage =
        'An unexpected error occurred. Please refresh the page and try again.'
    }

    return {
      originalError: error,
      userMessage,
      technicalMessage,
      timestamp,
    }
  }
}
