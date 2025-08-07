import {Component, inject, OnInit, OnDestroy} from '@angular/core'
import {CommonModule} from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import {Router} from '@angular/router'
import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatButtonModule} from '@angular/material/button'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {Subject, takeUntil, filter, take, switchMap} from 'rxjs'

import {AuthService} from '../../../core/services/auth.service'
import {DashboardService} from '../../../core/services/dashboard.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly dashboardService = inject(DashboardService)
  private readonly router = inject(Router)
  private readonly destroy$ = new Subject<void>()

  loginForm: FormGroup
  isLoading = false
  errorMessage: string | undefined = undefined

  constructor() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    })
  }

  ngOnInit(): void {
    this.authService.authCheckComplete$
      .pipe(
        filter((complete) => complete),
        take(1),
        switchMap(() => this.authService.isAuthenticated$),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.redirectToDashboard()
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched()

    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true
      this.errorMessage = undefined

      const credentials = this.loginForm.value

      this.authService
        .login(credentials)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading = false
            this.redirectToDashboard()
          },
          error: (error) => {
            this.isLoading = false
            this.errorMessage = error.message
          },
        })
    }
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName)
    if (field?.hasError('required') && field?.touched) {
      return `${fieldName === 'userName' ? 'Username' : 'Password'} is required`
    }
    if (field?.hasError('minlength') && field?.touched) {
      return `${
        fieldName === 'userName' ? 'Username' : 'Password'
      } cannot be empty`
    }
    return ''
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName)
    return !!(field?.invalid && field?.touched)
  }

  private redirectToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }
}
