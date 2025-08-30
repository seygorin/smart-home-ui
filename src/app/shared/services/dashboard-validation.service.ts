import {Injectable} from '@angular/core'
import {Observable, of} from 'rxjs'
import {DashboardValidators} from '../validators'
import {ValidatorFn} from '@angular/forms'
import {ValidationResult, ValidationError} from '../models'


@Injectable({
  providedIn: 'root',
})
export class DashboardValidationService {
  createUniqueIdValidator(existingIds: string[]): ValidatorFn {
    return DashboardValidators.uniqueId(existingIds)
  }

  createUniqueTabTitleValidator(
    existingTitles: string[],
    currentTitle?: string
  ): ValidatorFn {
    return DashboardValidators.uniqueTabTitle(existingTitles, currentTitle)
  }

  createRequiredValidator(fieldName: string): ValidatorFn {
    return DashboardValidators.required(fieldName)
  }

  createMaxLengthValidator(maxLength: number, fieldName: string): ValidatorFn {
    return DashboardValidators.maxLength(maxLength, fieldName)
  }

  createDashboardIdFormatValidator(): ValidatorFn {
    return DashboardValidators.dashboardIdFormat()
  }

  createNoWhitespaceOnlyValidator(): ValidatorFn {
    return DashboardValidators.noWhitespaceOnly()
  }

  isDashboardIdUnique(
    dashboardId: string,
    existingIds: string[]
  ): Observable<boolean> {
    if (!dashboardId) {
      return of(true) 
    }

    const isUnique = !existingIds.some(
      (id) => id.toLowerCase() === dashboardId.toLowerCase()
    )

    return of(isUnique)
  }

  isTabTitleUnique(
    tabTitle: string,
    existingTitles: string[],
    currentTitle?: string
  ): Observable<boolean> {
    if (!tabTitle) {
      return of(true) 
    }

    const trimmedTitle = tabTitle.trim()

    if (currentTitle && trimmedTitle === currentTitle) {
      return of(true)
    }

    const isUnique = !existingTitles.some(
      (title) => title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    )

    return of(isUnique)
  }

  validateDashboardForm(
    formData: {id: string; title: string; icon: string},
    existingIds: string[]
  ): Observable<ValidationResult> {
    const errors: ValidationError[] = []

    if (!formData.id || formData.id.trim().length === 0) {
      errors.push({field: 'id', message: 'Dashboard ID is required'})
    } else {
      if (formData.id.length > 30) {
        errors.push({
          field: 'id',
          message: 'Dashboard ID must be 30 characters or less',
        })
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(formData.id)) {
        errors.push({
          field: 'id',
          message:
            'Dashboard ID can only contain letters, numbers, hyphens, and underscores',
        })
      }

      if (
        existingIds.some((id) => id.toLowerCase() === formData.id.toLowerCase())
      ) {
        errors.push({field: 'id', message: 'Dashboard ID already exists'})
      }
    }

    if (!formData.title || formData.title.trim().length === 0) {
      errors.push({field: 'title', message: 'Title is required'})
    } else if (formData.title.length > 50) {
      errors.push({
        field: 'title',
        message: 'Title must be 50 characters or less',
      })
    }

    if (!formData.icon) {
      errors.push({field: 'icon', message: 'Icon is required'})
    }

    return of({
      isValid: errors.length === 0,
      errors,
    })
  }

  validateTabForm(
    formData: {title: string},
    existingTitles: string[],
    currentTitle?: string
  ): Observable<ValidationResult> {
    const errors: ValidationError[] = []

    if (!formData.title || formData.title.trim().length === 0) {
      errors.push({field: 'title', message: 'Tab title is required'})
    } else {
      if (formData.title.length > 50) {
        errors.push({
          field: 'title',
          message: 'Tab title must be 50 characters or less',
        })
      }

      const trimmedTitle = formData.title.trim()

      if (!(currentTitle && trimmedTitle === currentTitle)) {
        if (
          existingTitles.some(
            (title) => title.trim().toLowerCase() === trimmedTitle.toLowerCase()
          )
        ) {
          errors.push({
            field: 'title',
            message: 'Tab title must be unique within the dashboard',
          })
        }
      }
    }

    return of({
      isValid: errors.length === 0,
      errors,
    })
  }

  generateIdFromTitle(title: string): string {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-') 
      .replace(/^-|-$/g, '')
  }
}
