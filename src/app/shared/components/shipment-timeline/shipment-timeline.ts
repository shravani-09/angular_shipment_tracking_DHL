import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Shipment } from '../../../core/models/shipment.model';
import { getStatusLabel } from '../../../features/admin/update-shipment/update-shipment';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-shipment-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipment-timeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentTimeline {
  @Input() shipment: Shipment | undefined;

  constants = APP_CONSTANTS;
  getStatusLabel = getStatusLabel;
  trackByIndex = (index: number): number => index;

  isMilestoneCompleted(milestone: any, shipment: Shipment): boolean {
    return Number(milestone.status) !== 6;
  }

  isMilestoneDelayed(milestone: any): boolean {
    return Number(milestone.status) === 6;
  }

  formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return timestamp;
    }
  }
}
