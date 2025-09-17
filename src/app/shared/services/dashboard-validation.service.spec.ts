import {TestBed} from '@angular/core/testing'
import {FormControl} from '@angular/forms'
import {provideMockStore} from '@ngrx/store/testing'
import {DashboardValidationService} from './dashboard-validation.service'

describe('DashboardValidationService', () => {
  let service: DashboardValidationService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    })
    service = TestBed.inject(DashboardValidationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('createUniqueIdValidator', () => {
    it('should create validator that returns null for unique ID', () => {
      const existingIds = ['dashboard1', 'dashboard2']
      const validator = service.createUniqueIdValidator(existingIds)
      const control = new FormControl('dashboard3')

      expect(validator(control)).toBeNull()
    })

    it('should create validator that returns error for duplicate ID', () => {
      const existingIds = ['dashboard1', 'dashboard2']
      const validator = service.createUniqueIdValidator(existingIds)
      const control = new FormControl('dashboard1')

      const result = validator(control)
      expect(result).toEqual({uniqueId: {value: 'dashboard1'}})
    })
  })

  describe('createUniqueTabTitleValidator', () => {
    it('should create validator that returns null for unique title', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = service.createUniqueTabTitleValidator(existingTitles)
      const control = new FormControl('Kitchen')

      expect(validator(control)).toBeNull()
    })

    it('should create validator that returns error for duplicate title', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = service.createUniqueTabTitleValidator(existingTitles)
      const control = new FormControl('Home')

      const result = validator(control)
      expect(result).toEqual({uniqueTabTitle: {value: 'Home'}})
    })

    it('should allow current title when editing', () => {
      const existingTitles = ['Home', 'Living Room']
      const validator = service.createUniqueTabTitleValidator(
        existingTitles,
        'Home'
      )
      const control = new FormControl('Home')

      expect(validator(control)).toBeNull()
    })
  })

  describe('createRequiredValidator', () => {
    it('should create validator with custom error message', () => {
      const validator = service.createRequiredValidator('Dashboard ID')
      const control = new FormControl('')

      const result = validator(control)
      expect(result).toEqual({
        required: {
          message: 'Dashboard ID is required',
          fieldName: 'Dashboard ID',
        },
      })
    })
  })

  describe('createMaxLengthValidator', () => {
    it('should create validator with custom error message', () => {
      const validator = service.createMaxLengthValidator(5, 'Title')
      const control = new FormControl('too long')

      const result = validator(control)
      expect(result).toEqual({
        maxLength: {
          actualLength: 8,
          requiredLength: 5,
          message: 'Title must be 5 characters or less',
          fieldName: 'Title',
        },
      })
    })
  })

  describe('isDashboardIdUnique', () => {
    it('should return true for unique ID', (done) => {
      const existingIds = ['dashboard1', 'dashboard2']

      service
        .isDashboardIdUnique('dashboard3', existingIds)
        .subscribe((result) => {
          expect(result).toBe(true)
          done()
        })
    })

    it('should return false for duplicate ID', (done) => {
      const existingIds = ['dashboard1', 'dashboard2']

      service
        .isDashboardIdUnique('dashboard1', existingIds)
        .subscribe((result) => {
          expect(result).toBe(false)
          done()
        })
    })

    it('should be case insensitive', (done) => {
      const existingIds = ['Dashboard1', 'dashboard2']

      service
        .isDashboardIdUnique('DASHBOARD1', existingIds)
        .subscribe((result) => {
          expect(result).toBe(false)
          done()
        })
    })

    it('should return true for empty ID', (done) => {
      const existingIds = ['dashboard1']

      service.isDashboardIdUnique('', existingIds).subscribe((result) => {
        expect(result).toBe(true)
        done()
      })
    })
  })

  describe('isTabTitleUnique', () => {
    it('should return true for unique title', (done) => {
      const existingTitles = ['Home', 'Living Room']

      service
        .isTabTitleUnique('Kitchen', existingTitles)
        .subscribe((result) => {
          expect(result).toBe(true)
          done()
        })
    })

    it('should return false for duplicate title', (done) => {
      const existingTitles = ['Home', 'Living Room']

      service.isTabTitleUnique('Home', existingTitles).subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })

    it('should be case insensitive', (done) => {
      const existingTitles = ['Home', 'Living Room']

      service.isTabTitleUnique('HOME', existingTitles).subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })

    it('should trim whitespace', (done) => {
      const existingTitles = ['Home', 'Living Room']

      service
        .isTabTitleUnique('  Home  ', existingTitles)
        .subscribe((result) => {
          expect(result).toBe(false)
          done()
        })
    })

    it('should allow current title when editing', (done) => {
      const existingTitles = ['Home', 'Living Room']

      service
        .isTabTitleUnique('Home', existingTitles, 'Home')
        .subscribe((result) => {
          expect(result).toBe(true)
          done()
        })
    })
  })

  describe('validateDashboardForm', () => {
    it('should return valid result for valid form data', (done) => {
      const formData = {id: 'valid-id', title: 'Valid Title', icon: 'home'}
      const existingIds = ['other-id']

      service
        .validateDashboardForm(formData, existingIds)
        .subscribe((result) => {
          expect(result.isValid).toBe(true)
          expect(result.errors).toEqual([])
          done()
        })
    })

    it('should return errors for invalid form data', (done) => {
      const formData = {id: '', title: '', icon: ''}
      const existingIds: string[] = []

      service
        .validateDashboardForm(formData, existingIds)
        .subscribe((result) => {
          expect(result.isValid).toBe(false)
          expect(result.errors.length).toBe(3)
          expect(result.errors).toContain({
            field: 'id',
            message: 'Dashboard ID is required',
          })
          expect(result.errors).toContain({
            field: 'title',
            message: 'Title is required',
          })
          expect(result.errors).toContain({
            field: 'icon',
            message: 'Icon is required',
          })
          done()
        })
    })

    it('should return error for duplicate ID', (done) => {
      const formData = {id: 'existing-id', title: 'Valid Title', icon: 'home'}
      const existingIds = ['existing-id']

      service
        .validateDashboardForm(formData, existingIds)
        .subscribe((result) => {
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain({
            field: 'id',
            message: 'Dashboard ID already exists',
          })
          done()
        })
    })

    it('should return error for invalid ID format', (done) => {
      const formData = {id: 'invalid id!', title: 'Valid Title', icon: 'home'}
      const existingIds: string[] = []

      service
        .validateDashboardForm(formData, existingIds)
        .subscribe((result) => {
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain({
            field: 'id',
            message:
              'Dashboard ID can only contain letters, numbers, hyphens, and underscores',
          })
          done()
        })
    })

    it('should return error for too long fields', (done) => {
      const formData = {
        id: 'a'.repeat(31),
        title: 'a'.repeat(51),
        icon: 'home',
      }
      const existingIds: string[] = []

      service
        .validateDashboardForm(formData, existingIds)
        .subscribe((result) => {
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain({
            field: 'id',
            message: 'Dashboard ID must be 30 characters or less',
          })
          expect(result.errors).toContain({
            field: 'title',
            message: 'Title must be 50 characters or less',
          })
          done()
        })
    })
  })

  describe('validateTabForm', () => {
    it('should return valid result for valid form data', (done) => {
      const formData = {title: 'Valid Title'}
      const existingTitles = ['Other Title']

      service.validateTabForm(formData, existingTitles).subscribe((result) => {
        expect(result.isValid).toBe(true)
        expect(result.errors).toEqual([])
        done()
      })
    })

    it('should return error for empty title', (done) => {
      const formData = {title: ''}
      const existingTitles: string[] = []

      service.validateTabForm(formData, existingTitles).subscribe((result) => {
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain({
          field: 'title',
          message: 'Tab title is required',
        })
        done()
      })
    })

    it('should return error for duplicate title', (done) => {
      const formData = {title: 'Existing Title'}
      const existingTitles = ['Existing Title']

      service.validateTabForm(formData, existingTitles).subscribe((result) => {
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain({
          field: 'title',
          message: 'Tab title must be unique within the dashboard',
        })
        done()
      })
    })

    it('should return error for too long title', (done) => {
      const formData = {title: 'a'.repeat(51)}
      const existingTitles: string[] = []

      service.validateTabForm(formData, existingTitles).subscribe((result) => {
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain({
          field: 'title',
          message: 'Tab title must be 50 characters or less',
        })
        done()
      })
    })

    it('should allow current title when editing', (done) => {
      const formData = {title: 'Current Title'}
      const existingTitles = ['Current Title']

      service
        .validateTabForm(formData, existingTitles, 'Current Title')
        .subscribe((result) => {
          expect(result.isValid).toBe(true)
          expect(result.errors).toEqual([])
          done()
        })
    })
  })

  describe('generateIdFromTitle', () => {
    it('should convert title to kebab-case', () => {
      const result = service.generateIdFromTitle('My Dashboard Title')
      expect(result).toBe('my-dashboard-title')
    })

    it('should remove special characters', () => {
      const result = service.generateIdFromTitle('My Dashboard! @#$% Title')
      expect(result).toBe('my-dashboard-title')
    })

    it('should handle multiple spaces', () => {
      const result = service.generateIdFromTitle('My    Dashboard   Title')
      expect(result).toBe('my-dashboard-title')
    })

    it('should handle leading/trailing spaces', () => {
      const result = service.generateIdFromTitle('  My Dashboard Title  ')
      expect(result).toBe('my-dashboard-title')
    })

    it('should handle multiple hyphens', () => {
      const result = service.generateIdFromTitle('My--Dashboard--Title')
      expect(result).toBe('my-dashboard-title')
    })

    it('should handle leading/trailing hyphens', () => {
      const result = service.generateIdFromTitle('-My Dashboard Title-')
      expect(result).toBe('my-dashboard-title')
    })

    it('should handle empty string', () => {
      const result = service.generateIdFromTitle('')
      expect(result).toBe('')
    })

    it('should handle numbers', () => {
      const result = service.generateIdFromTitle('Dashboard 123 Title')
      expect(result).toBe('dashboard-123-title')
    })
  })
})
