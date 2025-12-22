import { Component, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShipmentService } from '../../../core/services/shipment.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { ApiErrorResponse } from '../../../core/models/auth.model';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import {
  lettersSpacesHyphensValidator,
  futureDateValidator,
  getOriginDestinationErrorMessage,
  getDateErrorMessage,
} from '../../../core/validators/custom-validators';
@Component({
  selector: 'app-create-shipment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessage],
  templateUrl: './create-shipment.html',
})
export class CreateShipment {
  constants = APP_CONSTANTS;
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(NonNullableFormBuilder);
  private shipmentService = inject(ShipmentService);
  private router = inject(Router);

  loading: boolean = false;
  success: string = '';
  error: string = '';
  minDate: string = '';

  form: FormGroup<{
    origin: FormControl<string>;
    destination: FormControl<string>;
    estimatedDeliveryDate: FormControl<string>;
  }>;

  constructor() {
    this.form = this.fb.group({
      origin: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          lettersSpacesHyphensValidator(),
        ],
      ],
      destination: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          lettersSpacesHyphensValidator(),
        ],
      ],
      estimatedDeliveryDate: ['', [Validators.required, futureDateValidator()]],
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  submit(): void {
    if (this.form.invalid) {
      const originErrors = this.form.get('origin')?.errors;
      const destinationErrors = this.form.get('destination')?.errors;
      const dateErrors = this.form.get('estimatedDeliveryDate')?.errors;

      if (originErrors) {
        this.error = getOriginDestinationErrorMessage(originErrors, 'Origin');
        return;
      }
      if (destinationErrors) {
        this.error = getOriginDestinationErrorMessage(destinationErrors, 'Destination');
        return;
      }
      if (dateErrors) {
        this.error = getDateErrorMessage(dateErrors);
        return;
      }

      this.error = APP_CONSTANTS.ERROR_MESSAGES.ALL_FIELDS_REQUIRED;
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.shipmentService
      .createShipment(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (): void => {
          this.success = APP_CONSTANTS.ERROR_MESSAGES.SHIPMENT_CREATED_SUCCESS;
          this.form.reset();
          this.loading = false;
          this.cdr.markForCheck();
          setTimeout(() => {
            this.shipmentService.notifyShipmentUpdated();
            this.router.navigate(['/track']);
          }, 500);
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

  cancel(): void {
    this.router.navigate(['/track']);
  }
}
