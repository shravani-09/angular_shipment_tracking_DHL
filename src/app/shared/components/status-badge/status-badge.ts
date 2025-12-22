import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getStatusLabel } from '../../../features/admin/update-shipment/update-shipment';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span
    *ngIf="status !== undefined"
    class="ml-2 px-3 py-1 rounded-full text-sm font-medium"
    [ngClass]="{
      'bg-red-100 text-red-800': isStatusException(status),
      'bg-orange-100 text-orange-800': isStatusDelayed(status),
      'bg-green-100 text-green-800': isStatusOutForDelivery(status),
      'bg-emerald-100 text-emerald-800': isStatusDelivered(status),
      'bg-blue-100 text-blue-800': isStatusInTransit(status)
    }"
    [attr.aria-label]="'Current shipment status: ' + getStatusLabel(status)"
  >
    {{ getStatusLabel(status) }}
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  @Input() status: string | number | undefined;

  getStatusLabel = getStatusLabel;

  isStatusException(statusValue: string | number): boolean {
    return Number(statusValue) === 7;
  }

  isStatusDelayed(statusValue: string | number): boolean {
    return Number(statusValue) === 6;
  }

  isStatusOutForDelivery(statusValue: string | number): boolean {
    return Number(statusValue) === 4;
  }

  isStatusDelivered(statusValue: string | number): boolean {
    return Number(statusValue) === 5;
  }

  isStatusInTransit(statusValue: string | number): boolean {
    return Number(statusValue) === 2;
  }
}
