import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
  inject,
  HostListener,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Subject,
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  startWith,
  of,
  Observable,
  takeUntil,
} from 'rxjs';
import { ShipmentService } from '../../../core/services/shipment.service';
import { AuthService } from '../../../core/services/auth.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { getStatusLabel } from '../../admin/update-shipment/update-shipment';
import { Shipment } from '../../../core/models/shipment.model';
import { ApiErrorResponse } from '../../../core/models/auth.model';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { Loader } from '../../../shared/components/loader/loader';
import { TrackingInput } from '../../../shared/components/tracking-input/tracking-input';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { ShipmentTimeline } from '../../../shared/components/shipment-timeline/shipment-timeline';

@Component({
  selector: 'app-track-shipment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ErrorMessage,
    Loader,
    TrackingInput,
    StatusBadge,
    ShipmentTimeline,
  ],
  templateUrl: './track-shipment.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackShipment implements OnInit {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private shipmentService = inject(ShipmentService);
  private authService = inject(AuthService);
  private cancelRequest$ = new Subject<void>();
  private searchInput$ = new BehaviorSubject<string>('');
  private allTrackingIdsLoaded = false;

  trackingId: string = '';
  loading: boolean = false;
  error: string = '';
  shipment: Shipment | undefined = undefined;
  constants = APP_CONSTANTS;
  showDropdown: boolean = false;
  loadingDropdown: boolean = false;
  dropdownError: string = '';
  filteredTrackingIds: string[] = [];
  allTrackingIds: string[] = [];

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  trackByIndex = (index: number): number => index;

  getStatusLabel = getStatusLabel;

  ngOnInit(): void {
    if (this.isAdmin) {
      this.loadAdminShipments();
    }

    this.shipmentService
      .getShipmentUpdatedNotifier()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.refetchAdminShipments();
      });

    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.filterTrackingIds(searchTerm)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (filtered: string[]) => {
          this.filteredTrackingIds = filtered;
          this.cdr.markForCheck();
        },
        error: () => {
          this.filteredTrackingIds = [];
          this.cdr.markForCheck();
        },
      });
  }

  private loadAdminShipments(): void {
    this.shipmentService
      .getAdminCreatedShipments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (shipments: Shipment[]) => {
          this.allTrackingIds = shipments.map((s) => s.trackingId);
          this.allTrackingIdsLoaded = true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.allTrackingIdsLoaded = true;
        },
      });
  }

  refetchAdminShipments(): void {
    this.shipmentService.clearAdminCache();
    this.loadAdminShipments();
  }

  refreshAdminShipments(): void {
    this.allTrackingIdsLoaded = false;
    this.allTrackingIds = [];
    this.filteredTrackingIds = [];
  }

  constructor() {}

  private filterTrackingIds(searchTerm: string): Observable<string[]> {
    if (!this.isAdmin) {
      return of([]);
    }

    if (!this.allTrackingIdsLoaded) {
      return this.shipmentService.getAdminCreatedShipments().pipe(
        map((shipments: Shipment[]) => {
          this.allTrackingIds = shipments.map((s) => s.trackingId);
          this.allTrackingIdsLoaded = true;
          this.cdr.markForCheck();
          return this.filterList(searchTerm);
        })
      );
    }
    return of(this.filterList(searchTerm));
  }

  private filterList(searchTerm: string): string[] {
    if (!searchTerm.trim()) {
      return this.allTrackingIds;
    }
    return this.allTrackingIds.filter((id) => id.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  onDropdownFocus(): void {
    if (this.isAdmin) {
      this.showDropdown = true;
      this.cdr.markForCheck();

      if (!this.allTrackingIdsLoaded) {
        this.loadingDropdown = true;
        this.dropdownError = '';
        this.shipmentService
          .getAdminCreatedShipments()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (shipments: Shipment[]) => {
              this.allTrackingIds = shipments.map((s) => s.trackingId);
              this.allTrackingIdsLoaded = true;
              this.filteredTrackingIds = this.allTrackingIds;
              this.loadingDropdown = false;
              this.cdr.markForCheck();
            },
            error: () => {
              this.dropdownError = APP_CONSTANTS.ERROR_MESSAGES.SOMETHING_WENT_WRONG;
              this.loadingDropdown = false;
              this.cdr.markForCheck();
            },
          });
      } else {
        this.filteredTrackingIds = this.allTrackingIds;
      }
    }
  }

  onInputChange(value: string): void {
    this.trackingId = value;
    this.searchInput$.next(value);
  }

  selectTrackingId(id: string): void {
    this.trackingId = id;
    this.showDropdown = false;
    this.cdr.markForCheck();
  }

  closeDropdown(): void {
    this.showDropdown = false;
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdownContainer = document.querySelector('[role="listbox"]');
    const inputField = document.querySelector('input[autocomplete="off"]');

    if (
      this.showDropdown &&
      !dropdownContainer?.contains(target) &&
      !inputField?.contains(target)
    ) {
      this.closeDropdown();
    }
  }

  track(): void {
    const trimmedId: string = this.trackingId.trim();

    if (!trimmedId) {
      this.error = APP_CONSTANTS.VALIDATION_MESSAGES.TRACKING_ID.REQUIRED;
      return;
    }

    if (!APP_CONSTANTS.REGEX.TRACKING_ID.test(trimmedId)) {
      this.error = APP_CONSTANTS.VALIDATION_MESSAGES.TRACKING_ID.INVALID_FORMAT;
      return;
    }

    this.cancelRequest$.next();

    this.loading = true;
    this.error = '';
    this.shipment = undefined;

    this.shipmentService
      .trackShipment(this.trackingId.trim())
      .pipe(takeUntil(this.cancelRequest$), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Shipment): void => {
          this.shipment = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err: ApiErrorResponse | any): void => {
          this.error =
            err?.error?.message ||
            err?.message ||
            APP_CONSTANTS.ERROR_MESSAGES.SOMETHING_WENT_WRONG;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  getLastMilestoneTime(shipment: Shipment): string | null {
    if (!shipment.milestones || shipment.milestones.length === 0) {
      return null;
    }
    return shipment.milestones[shipment.milestones.length - 1].timestamp;
  }
}
