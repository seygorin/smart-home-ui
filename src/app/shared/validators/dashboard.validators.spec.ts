import {FormControl} from '@angular/forms'
import {DashboardValidators} from './dashboard.validators'

describe('DashboardValidators', () => {
  describe('uniqueId', () => {
    it('should return null for unique ID', () => {
      const existingIds = ['dashboard1', 'dashboard2']
      const validator = DashboardValidators.uniqueId(existingIds)
      const control = new FormControl('dashboard3')

      expect(validator(control)).toBeNull()
    })

    it('should return error for duplicate ID', () => {
      const existingIds = ['dashboard1', 'dashboard2']
      const validator = DashboardValidators.uniqueId(existingIds)
      const control = new FormControl('dashboard1')

      const result = validator(control)
      expect(result).toEqual({uniqueId: {value: 'dashboard1'}})
    })

    it('should be case insensitive', () => {
      const existingIds = ['Dashboard1', 'dashboard2']
      const validator = DashboardValidators.uniqueId(existingIds)
      const control = new FormControl('DASHBOARD1')

      const result = validator(control)
      expect(result).toEqual({uniqueId: {value: 'DASHBOARD1'}})
    })

    it('should return null for empty value', () => {
      const existingIds = ['dashboard1']
      const validator = DashboardValidators.uniqueId(existingIds)
      const control = new FormControl('')

      expect(validator(control)).toBeNull()
    })
  })

  describe('uniqueTabTitle', () => {
    it('should return null for unique title', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = DashboardValidators.uniqueTabTitle(existingTitles)
      const control = new FormControl('Kitchen')

      expect(validator(control)).toBeNull()
    })

    it('should return error for duplicate title', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = DashboardValidators.uniqueTabTitle(existingTitles)
      const control = new FormControl('Home')

      const result = validator(control)
      expect(result).toEqual({uniqueTabTitle: {value: 'Home'}})
    })

    it('should be case insensitive', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = DashboardValidators.uniqueTabTitle(existingTitles)
      const control = new FormControl('HOME')

      const result = validator(control)
      expect(result).toEqual({uniqueTabTitle: {value: 'HOME'}})
    })

    it('should allow current title when editing', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = DashboardValidators.uniqueTabTitle(
        existingTitles,
        'Home'
      )
      const control = new FormControl('Home')

      expect(validator(control)).toBeNull()
    })

    it('should trim whitespace', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = DashboardValidators.uniqueTabTitle(existingTitles)
      const control = new FormControl('  Home  ')

      const result = validator(control)
      expect(result).toEqual({uniqueTabTitle: {value: '  Home  '}})
    })
  })

  describe('required', () => {
    it('should return null for valid value', () => {
      const validator = DashboardValidators.required('Dashboard ID')
      const control = new FormControl('valid-value')

      expect(validator(control)).toBeNull()
    })

    it('should return error for empty value', () => {
      const validator = DashboardValidators.required('Dashboard ID')
      const control = new FormControl('')

      const result = validator(control)
      expect(result).toEqual({
        required: {
          message: 'Dashboard ID is required',
          fieldName: 'Dashboard ID',
        },
      })
    })

    it('should return error for whitespace only', () => {
      const validator = DashboardValidators.required('Title')
      const control = new FormControl('   ')

      const result = validator(control)
      expect(result).toEqual({
        required: {
          message: 'Title is required',
          fieldName: 'Title',
        },
      })
    })

    it('should return error for null value', () => {
      const validator = DashboardValidators.required('Icon')
      const control = new FormControl(null)

      const result = validator(control)
      expect(result).toEqual({
        required: {
          message: 'Icon is required',
          fieldName: 'Icon',
        },
      })
    })
  })

  describe('maxLength', () => {
    it('should return null for valid length', () => {
      const validator = DashboardValidators.maxLength(30, 'Dashboard ID')
      const control = new FormControl('valid-id')

      expect(validator(control)).toBeNull()
    })

    it('should return error for exceeding max length', () => {
      const validator = DashboardValidators.maxLength(5, 'Title')
      const control = new FormControl('too-long-title')

      const result = validator(control)
      expect(result).toEqual({
        maxLength: {
          actualLength: 14,
          requiredLength: 5,
          message: 'Title must be 5 characters or less',
          fieldName: 'Title',
        },
      })
    })

    it('should return null for empty value', () => {
      const validator = DashboardValidators.maxLength(10, 'Field')
      const control = new FormControl('')

      expect(validator(control)).toBeNull()
    })

    it('should handle exact max length', () => {
      const validator = DashboardValidators.maxLength(5, 'Field')
      const control = new FormControl('12345')

      expect(validator(control)).toBeNull()
    })
  })

  describe('dashboardIdFormat', () => {
    it('should return null for valid format', () => {
      const validator = DashboardValidators.dashboardIdFormat()
      const control = new FormControl('valid-id_123')

      expect(validator(control)).toBeNull()
    })

    it('should return error for invalid characters', () => {
      const validator = DashboardValidators.dashboardIdFormat()
      const control = new FormControl('invalid id!')

      const result = validator(control)
      expect(result).toEqual({
        dashboardIdFormat: {
          message:
            'Dashboard ID can only contain letters, numbers, hyphens, and underscores',
          value: 'invalid id!',
        },
      })
    })

    it('should return null for empty value', () => {
      const validator = DashboardValidators.dashboardIdFormat()
      const control = new FormControl('')

      expect(validator(control)).toBeNull()
    })

    it('should allow underscores and hyphens', () => {
      const validator = DashboardValidators.dashboardIdFormat()
      const control = new FormControl('valid_id-123')

      expect(validator(control)).toBeNull()
    })
  })

  describe('noWhitespaceOnly', () => {
    it('should return null for valid content', () => {
      const validator = DashboardValidators.noWhitespaceOnly()
      const control = new FormControl('valid content')

      expect(validator(control)).toBeNull()
    })

    it('should return error for whitespace only', () => {
      const validator = DashboardValidators.noWhitespaceOnly()
      const control = new FormControl('   ')

      const result = validator(control)
      expect(result).toEqual({
        whitespaceOnly: {
          message: 'Field cannot contain only whitespace',
        },
      })
    })

    it('should return null for empty value', () => {
      const validator = DashboardValidators.noWhitespaceOnly()
      const control = new FormControl('')

      expect(validator(control)).toBeNull()
    })

    it('should return null for content with leading/trailing spaces', () => {
      const validator = DashboardValidators.noWhitespaceOnly()
      const control = new FormControl('  valid content  ')

      expect(validator(control)).toBeNull()
    })
  })
})
