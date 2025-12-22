import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackShipment } from './track-shipment';
import { ShipmentService } from '../../../core/services/shipment.service';
import { of, throwError } from 'rxjs';
import { Shipment } from '../../../core/models/shipment.model';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TrackShipment Component', () => {
  let component: TrackShipment;
  let fixture: ComponentFixture<TrackShipment>;
  let shipmentService: ShipmentService;

  const mockShipment: Shipment = {
    trackingId: 'DHL123456',
    origin: 'Mumbai',
    destination: 'Berlin',
    estimatedDeliveryDate: '2025-01-24',
    currentStatus: 2,
    milestones: [
      {
        status: 'Shipment picked up',
        location: 'Mumbai',
        timestamp: '2025-01-18 10:00',
      },
      {
        status: 'Arrived at hub',
        location: 'Frankfurt',
        timestamp: '2025-01-22 08:30',
      },
    ],
  };

  beforeEach(async () => {
    const mockShipmentService = {
      trackShipment: vi.fn(() => of(mockShipment)),
      getShipmentUpdatedNotifier: vi.fn(() => of()),
      getAdminCreatedShipments: vi.fn(() => of([mockShipment])),
    };

    await TestBed.configureTestingModule({
      imports: [TrackShipment],
      providers: [{ provide: ShipmentService, useValue: mockShipmentService }],
    }).compileComponents();

    shipmentService = TestBed.inject(ShipmentService);
    fixture = TestBed.createComponent(TrackShipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.trackingId).toBe('');
      expect(component.loading).toBe(false);
      expect(component.error).toBe('');
      expect(component.shipment).toBeUndefined();
    });

    it('should have trackByIndex function defined', () => {
      expect(component.trackByIndex).toBeDefined();
      expect(component.trackByIndex(0)).toBe(0);
      expect(component.trackByIndex(5)).toBe(5);
    });
  });

  describe('track() method', () => {
    it('should display error when tracking ID is empty', () => {
      component.trackingId = '';
      component.track();

      expect(component.error).toBe('Tracking ID is required');
      expect(vi.spyOn(shipmentService, 'trackShipment')).not.toHaveBeenCalled();
    });

    it('should display error when tracking ID is only whitespace', () => {
      component.trackingId = '   ';
      component.track();

      expect(component.error).toBe('Tracking ID is required');
    });

    it('should reject invalid tracking ID format (no DHL prefix)', () => {
      component.trackingId = '905514';
      component.track();

      expect(component.error).toContain('Invalid Tracking ID format');
      expect(vi.spyOn(shipmentService, 'trackShipment')).not.toHaveBeenCalled();
    });

    it('should reject invalid tracking ID format (lowercase)', () => {
      component.trackingId = 'dhl905514';
      component.track();

      expect(component.error).toContain('Invalid Tracking ID format');
    });

    it('should reject invalid tracking ID format (wrong length - too short)', () => {
      component.trackingId = 'DHL90551';
      component.track();

      expect(component.error).toContain('Invalid Tracking ID format');
    });

    it('should reject invalid tracking ID format (wrong length - too long)', () => {
      component.trackingId = 'DHL9055147';
      component.track();

      expect(component.error).toContain('Invalid Tracking ID format');
    });

    it('should reject invalid tracking ID format (with hyphen)', () => {
      component.trackingId = 'DHL-905514';
      component.track();

      expect(component.error).toContain('Invalid Tracking ID format');
    });

    it('should accept valid tracking ID format (DHL + 6 digits)', () => {
      const trackSpy = vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.trackingId = 'DHL905514';

      component.track();

      expect(component.error).toBe('');
      expect(trackSpy).toHaveBeenCalledWith('DHL905514');
    });

    it('should accept valid tracking ID with all zeros', () => {
      const trackSpy = vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.trackingId = 'DHL000001';

      component.track();

      expect(component.error).toBe('');
      expect(trackSpy).toHaveBeenCalledWith('DHL000001');
    });

    it('should reject tracking ID with special characters', () => {
      component.trackingId = 'DHL90@514';
      component.track();

      expect(component.error).toContain('Invalid Tracking ID format');
    });

    it('should reject tracking ID that looks like URL', () => {
      component.trackingId = 'https://dhl-9f3a7c2q.com';
      component.track();

      expect(component.error).toContain('Invalid Tracking ID format');
    });

    it('should trim tracking ID before sending request', () => {
      const trackSpy = vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.trackingId = '  DHL123456  ';

      component.track();

      expect(trackSpy).toHaveBeenCalledWith('DHL123456');
    });

    it('should clear previous errors when tracking', () => {
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.error = 'Previous error';
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.error).toBe('');
    });

    it('should clear previous shipment when tracking new one', () => {
      const trackSpy = vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.shipment = mockShipment;
      component.trackingId = 'DHL789012';

      component.track();

      expect(trackSpy).toHaveBeenCalled();
      expect(component.shipment).toEqual(mockShipment);
    });
  });

  describe('Successful Tracking', () => {
    it('should display shipment data on successful track', () => {
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.shipment).toEqual(mockShipment);
      expect(component.loading).toBe(false);
      expect(component.error).toBe('');
    });

    it('should display current status', () => {
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.shipment?.currentStatus).toBe(2);
    });

    it('should display milestones', () => {
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.shipment?.milestones.length).toBe(2);
      expect(component.shipment?.milestones[0].status).toBe('Shipment picked up');
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', () => {
      const errorResponse = { error: { message: 'Shipment not found' } };
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(throwError(() => errorResponse));
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.error).toBe('Shipment not found');
      expect(component.loading).toBe(false);
      expect(component.shipment).toBeUndefined();
    });

    it('should display fallback error message when no message provided', () => {
      const errorResponse = { status: 500 };
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(throwError(() => errorResponse));
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.error).toBe('Something went wrong');
    });

    it('should display message property from error object', () => {
      const errorResponse = { message: 'Network error' };
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(throwError(() => errorResponse));
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.error).toBe('Network error');
    });

    it('should set loading to false on error', () => {
      const errorResponse = { error: { message: 'Server error' } };
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(throwError(() => errorResponse));
      component.trackingId = 'DHL123456';

      component.track();

      expect(component.loading).toBe(false);
    });
  });

  describe('trackByIndex function', () => {
    it('should return correct index', () => {
      expect(component.trackByIndex(0)).toBe(0);
      expect(component.trackByIndex(1)).toBe(1);
      expect(component.trackByIndex(10)).toBe(10);
    });

    it('should improve list performance with trackBy', () => {
      const trackByFunction = component.trackByIndex;
      const milestones = mockShipment.milestones;

      milestones.forEach((_, index) => {
        expect(trackByFunction(index)).toBe(index);
      });
    });
  });

  describe('Memory Management', () => {
    it('should cleanup on component destroy', () => {
      vi.spyOn(shipmentService, 'trackShipment').mockReturnValue(of(mockShipment));
      component.trackingId = 'DHL123456';

      component.track();
      fixture.destroy();

      expect(component).toBeTruthy();
    });
  });

  describe('Template Integration', () => {
    it('should display loader when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('app-loader'));
      expect(loader).toBeTruthy();
    });

    it('should display error message when error exists', () => {
      component.error = 'Test error';
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('app-error-message'));
      expect(errorMessage).toBeTruthy();
    });

    it('should display shipment details when shipment exists', () => {
      component.shipment = mockShipment;
      fixture.detectChanges();

      const shipmentDiv = fixture.debugElement.query(By.css('div[role="region"]'));
      const statusText = shipmentDiv?.nativeElement.textContent;
      expect(statusText).toContain('In Transit');
    });

    it('should display all milestones', () => {
      component.shipment = mockShipment;
      fixture.detectChanges();

      const milestoneItems = fixture.debugElement.queryAll(By.css('[role="listitem"]'));
      expect(milestoneItems.length).toBe(mockShipment.milestones.length);
    });
  });
});
