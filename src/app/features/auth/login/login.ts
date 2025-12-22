import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { ApiErrorResponse } from '../../../core/models/auth.model';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import {
  emailValidator,
  getEmailErrorMessage,
  getPasswordErrorMessage,
} from '../../../core/validators/custom-validators';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessage],
  templateUrl: './login.html',
})
export class Login {
  private destroyRef = inject(DestroyRef);
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error: string = '';
  loading: boolean = false;
  constants = APP_CONSTANTS;

  form: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      const emailErrors = this.form.get('email')?.errors;
      const passwordErrors = this.form.get('password')?.errors;

      if (emailErrors) {
        this.error = getEmailErrorMessage(emailErrors);
        return;
      }
      if (passwordErrors) {
        this.error = getPasswordErrorMessage(passwordErrors);
        return;
      }

      this.error = APP_CONSTANTS.ERROR_MESSAGES.ALL_FIELDS_REQUIRED;
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth
      .login(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (): void => {
          this.router.navigate(['/track']);
          this.loading = false;
        },
        error: (err: ApiErrorResponse | any): void => {
          this.error =
            err?.error?.message ||
            err?.message ||
            APP_CONSTANTS.ERROR_MESSAGES.SOMETHING_WENT_WRONG;
          this.loading = false;
        },
      });
  }
}
