import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms'

export class DashboardValidators {

  static uniqueId(existingIds: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null 
      }

      const value = control.value.toString().toLowerCase()
      const isDuplicate = existingIds.some((id) => id.toLowerCase() === value)

      return isDuplicate ? {uniqueId: {value: control.value}} : null
    }
  }


  static uniqueTabTitle(
    existingTitles: string[],
    currentTitle?: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null 
      }

      const value = control.value.toString().trim()

      if (currentTitle && value === currentTitle) {
        return null
      }

      const isDuplicate = existingTitles.some(
        (title) => title.trim().toLowerCase() === value.toLowerCase()
      )

      return isDuplicate ? {uniqueTabTitle: {value: control.value}} : null
    }
  }


  static required(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.toString().trim().length === 0) {
        return {
          required: {
            message: `${fieldName} is required`,
            fieldName,
          },
        }
      }
      return null
    }
  }


  static maxLength(maxLength: number, fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null 
      }

      const length = control.value.toString().length
      if (length > maxLength) {
        return {
          maxLength: {
            actualLength: length,
            requiredLength: maxLength,
            message: `${fieldName} must be ${maxLength} characters or less`,
            fieldName,
          },
        }
      }

      return null
    }
  }


  static dashboardIdFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null 
      }

      const value = control.value.toString()
      const validPattern = /^[a-zA-Z0-9_-]+$/

      if (!validPattern.test(value)) {
        return {
          dashboardIdFormat: {
            message:
              'Dashboard ID can only contain letters, numbers, hyphens, and underscores',
            value: control.value,
          },
        }
      }

      return null
    }
  }


  static noWhitespaceOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        	return null 
      }

      const value = control.value.toString()
      if (value.trim().length === 0) {
        return {
          whitespaceOnly: {
            message: 'Field cannot contain only whitespace',
          },
        }
      }

      return null
    }
  }
}
