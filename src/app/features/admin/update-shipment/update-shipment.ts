import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShipmentService } from '../../../core/services/shipment.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { ApiErrorResponse } from '../../../core/models/auth.model';
import { Shipment } from '../../../core/models/shipment.model';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import {
  lettersSpacesHyphensValidator,
  getLocationErrorMessage,
} from '../../../core/validators/custom-validators';

export const SHIPMENT_STATUSES = [
  { label: 'Created', value: 0 },
  { label: 'Picked Up', value: 1 },
  { label: 'In Transit', value: 2 },
  { label: 'Arrived at Facility', value: 3 },
  { label: 'Out for Delivery', value: 4 },
  { label: 'Delivered', value: 5 },
  { label: 'Delayed', value: 6 },
  { label: 'Exception', value: 7 },
] as const;

const LIFECYCLE_ORDER = [0, 1, 2, 3, 4, 5];
const SPECIAL_STATUSES = [6, 7];

const STATUS_TRANSITIONS: Record<number, number[]> = {
  0: [1],
  1: [2],
  2: [3, 6, 7],
  3: [4, 6, 7],
  4: [5, 6, 7],
  5: [],
  6: [2, 4],
  7: [2],
};

export function getAllowedNextStatuses(currentStatus: number): number[] {
  return STATUS_TRANSITIONS[currentStatus] || [];
}

export type ShipmentStatusValue = (typeof SHIPMENT_STATUSES)[number]['value'];

export function getStatusLabel(value: number | string): string {
  const status = SHIPMENT_STATUSES.find((s) => s.value === Number(value));
  return status?.label || String(value);
}

export function getStatusValue(numericValue: number | string): number {
  return Number(numericValue);
}

@Component({
  selector: 'app-update-shipment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessage],
  templateUrl: './update-shipment.html',
  styles: [
    `
      select {
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
      }

      select:disabled {
        opacity: 0.6;
      }
    `,
  ],
})
export class UpdateShipment implements OnInit {
  constants = APP_CONSTANTS;
  private fb = inject(NonNullableFormBuilder);
  private shipmentService = inject(ShipmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  readonly shipmentStatuses = SHIPMENT_STATUSES;

  form!: FormGroup<{
    status: FormControl<string | number>;
    location: FormControl<string>;
  }>;

  loading: boolean = false;
  success: string = '';
  error: string = '';
  trackingId: string = '';
  currentShipment: Shipment | null = null;
  allowedStatuses: number[] = [];

  convertToString(value: number): string {
    return String(value);
  }

  isStatusAllowed(statusValue: number): boolean {
    if (!this.currentShipment) return false;
    const currentStatus = getStatusValue(this.currentShipment.currentStatus);
    if (currentStatus === 5) return false;
    return this.allowedStatuses.includes(statusValue);
  }

  isStatusDisabled(statusValue: number): boolean {
    if (!this.currentShipment) return false;
    const currentStatus = getStatusValue(this.currentShipment.currentStatus);
    if (currentStatus === 5) return true;
    if (currentStatus === statusValue) return true;
    return !this.isStatusAllowed(statusValue);
  }

  isFormDisabled(): boolean {
    if (!this.currentShipment) return false;
    return getStatusValue(this.currentShipment.currentStatus) === 5;
  }

  hasAvailableStatuses(): boolean {
    return this.allowedStatuses.length > 0;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      status: ['', [Validators.required]],
      location: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          lettersSpacesHyphensValidator(),
        ],
      ],
    }) as FormGroup<{
      status: FormControl<string | number>;
      location: FormControl<string>;
    }>;

    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params): void => {
        this.trackingId = params['id'];
        if (this.trackingId) {
          this.fetchShipmentDetails();
        }
      });
  }

  private fetchShipmentDetails(): void {
    this.shipmentService
      .trackShipment(this.trackingId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (shipment: Shipment): void => {
          this.currentShipment = shipment;
          const statusValue = getStatusValue(shipment.currentStatus);
          this.allowedStatuses = getAllowedNextStatuses(statusValue);
          this.form.patchValue({
            status: String(statusValue),
          });
          if (this.isFormDisabled()) {
            this.form.disable();
          }
        },
        error: (): void => {
          this.error = APP_CONSTANTS.ERROR_MESSAGES.SOMETHING_WENT_WRONG;
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/track']);
  }

  updateShipment(): void {
    if (this.form.invalid || !this.trackingId || this.isFormDisabled()) {
      const locationErrors = this.form.get('location')?.errors;
      const statusErrors = this.form.get('status')?.errors;

      if (statusErrors) {
        this.error = APP_CONSTANTS.VALIDATION_MESSAGES.STATUS.INVALID;
        return;
      }
      if (locationErrors) {
        this.error = getLocationErrorMessage(locationErrors);
        return;
      }
      if (!this.trackingId) {
        this.error = APP_CONSTANTS.ERROR_MESSAGES.INVALID_TRACKING_ID;
        return;
      }

      this.error = APP_CONSTANTS.ERROR_MESSAGES.ALL_FIELDS_REQUIRED;
      return;
    }

    const selectedStatusValue = Number(this.form.getRawValue().status);
    const currentStatusValue = getStatusValue(this.currentShipment?.currentStatus || 0);

    if (selectedStatusValue !== currentStatusValue && !this.isStatusAllowed(selectedStatusValue)) {
      this.error = 'Invalid status transition. Please select an allowed next status.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formValue = this.form.getRawValue();

    const payload = {
      status: Number(formValue.status),
      location: formValue.location,
    };

    this.shipmentService
      .updateStatus(this.trackingId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (shipment: Shipment): void => {
          this.success = APP_CONSTANTS.ERROR_MESSAGES.SHIPMENT_UPDATED_SUCCESS;
          this.loading = false;
          this.shipmentService.setLastViewedShipment(this.trackingId, shipment);
          setTimeout(() => {
            this.shipmentService.notifyShipmentUpdated();
            this.router.navigate(['/track']);
          }, 2000);
        },
        error: (err: ApiErrorResponse | any): void => {
          this.error =
            err?.error?.message || err?.message || APP_CONSTANTS.ERROR_MESSAGES.FAILED_TO_UPDATE;
          this.loading = false;
        },
      });
  }

  get status() {
    return this.form.get('status');
  }

  get location() {
    return this.form.get('location');
  }
}
