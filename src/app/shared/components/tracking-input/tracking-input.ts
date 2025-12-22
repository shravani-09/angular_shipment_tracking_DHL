import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-tracking-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracking-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingInput {
  @Input() trackingId: string = '';
  @Input() isAdmin: boolean = false;
  @Input() showDropdown: boolean = false;
  @Input() loadingDropdown: boolean = false;
  @Input() dropdownError: string = '';
  @Input() filteredTrackingIds: string[] = [];

  @Output() trackingIdChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();
  @Output() dropdownFocus = new EventEmitter<void>();
  @Output() selectId = new EventEmitter<string>();

  constants = APP_CONSTANTS;
  trackByIndex = (index: number): number => index;

  onInputChange(value: string): void {
    this.trackingIdChange.emit(value);
  }

  onSearch(): void {
    this.search.emit();
  }

  onDropdownFocus(): void {
    this.dropdownFocus.emit();
  }

  onSelectTrackingId(id: string): void {
    this.selectId.emit(id);
  }
}
