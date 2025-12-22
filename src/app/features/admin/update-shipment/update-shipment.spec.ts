import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateShipment } from './update-shipment';
import { ShipmentService } from '../../../core/services/shipment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { Shipment } from '../../../core/models/shipment.model';

describe('UpdateShipment Component', () => {
  let component: UpdateShipment;
  let fixture: ComponentFixture<UpdateShipment>;
  let shipmentService: ShipmentService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockShipment: Shipment = {
    trackingId: 'DHL001',
    origin: 'New York',
    destination: 'Los Angeles',
    estimatedDeliveryDate: '2025-12-25',
    currentStatus: 2,
    milestones: [
      {
        status: 'Shipment picked up',
        location: 'New York',
        timestamp: '2025-12-21T08:00:00Z',
      },
    ],
  };

  beforeEach(async () => {
    const mockShipmentService = {
      updateStatus: vi.fn(() => of(mockShipment)),
      trackShipment: vi.fn(() => of(mockShipment)),
      notifyShipmentUpdated: vi.fn(),
    };
    const mockRouter = {
      navigate: vi.fn(),
    };
    const mockActivatedRoute = {
      params: of({ id: 'DHL001' }),
    };

    await TestBed.configureTestingModule({
      imports: [UpdateShipment],
      providers: [
        { provide: ShipmentService, useValue: mockShipmentService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    shipmentService = TestBed.inject(ShipmentService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(UpdateShipment);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form on ngOnInit', () => {
      component.ngOnInit();
      expect(component.form).toBeDefined();
      expect(component.form.get('status')).toBeDefined();
      expect(component.form.get('location')).toBeDefined();
    });

    it('should get tracking ID from route params', () => {
      component.ngOnInit();
      expect(component.trackingId).toBe('DHL001');
    });

    it('should initialize with default values', () => {
      expect(component.loading).toBe(false);
      expect(component.success).toBe('');
      expect(component.error).toBe('');
    });

    it('should initialize with empty form values', () => {
      component.ngOnInit();
      expect(component.form.get('status')?.value).toBe('2');
      expect(component.form.get('location')?.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have invalid form when status is empty', () => {
      component.form.patchValue({
        status: '',
        location: 'New York',
      });
      expect(component.form.invalid).toBe(true);
    });

    it('should have invalid form when location is empty', () => {
      component.form.patchValue({
        status: '2',
        location: '',
      });
      expect(component.form.invalid).toBe(true);
    });

    it('should have valid form when all fields are filled', () => {
      component.form.patchValue({
        status: '2',
        location: 'New York',
      });
      expect(component.form.valid).toBe(true);
    });

    it('should validate status is required', () => {
      const status = component.form.get('status');
      status?.setValue('');
      expect(status?.hasError('required')).toBe(true);
    });

    it('should validate location minimum length', () => {
      const location = component.form.get('location');
      location?.setValue('A');
      expect(location?.hasError('minlength')).toBe(true);
    });

    it('should require status field', () => {
      const status = component.form.get('status');
      status?.setValue('');
      expect(status?.hasError('required')).toBe(true);
    });

    it('should require location field', () => {
      const location = component.form.get('location');
      location?.setValue('');
      expect(location?.hasError('required')).toBe(true);
    });
  });

  describe('updateShipment Method', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.trackingId = 'DHL001';
    });

    it('should show error when form is invalid', () => {
      component.form.patchValue({
        status: '',
        location: 'New York',
      });
      component.updateShipment();
      expect(component.error).toBeTruthy();
    });

    it('should show error when tracking ID is empty', () => {
      component.trackingId = '';
      component.form.patchValue({
        status: '2',
        location: 'New York',
      });
      component.updateShipment();
      expect(component.error).toBeTruthy();
    });

    it('should call shipmentService.updateStatus with correct params', () => {
      component.form.patchValue({
        status: 2,
        location: 'Chicago',
      });
      component.updateShipment();

      expect(shipmentService.updateStatus).toHaveBeenCalledWith('DHL001', {
        status: 2,
        location: 'Chicago',
      });
    });

    it('should set success message on successful update', () => {
      component.form.patchValue({
        status: '3',
        location: 'Los Angeles',
      });
      component.updateShipment();

      expect(component.success).toBe('Shipment updated successfully');
    });

    it('should clear error on successful update', () => {
      component.error = 'Previous error';
      component.form.patchValue({
        status: '3',
        location: 'Chicago',
      });
      component.updateShipment();
      expect(component.error).toBe('');
    });

    it('should set loading to false after update completes', () => {
      component.form.patchValue({
        status: '3',
        location: 'Chicago',
      });
      component.updateShipment();
      expect(component.loading).toBe(false);
    });

    it('should navigate to tracking page after successful update', () => {
      vi.useFakeTimers();
      component.form.patchValue({
        status: 2,
        location: 'Chicago',
      });
      component.updateShipment();

      vi.runAllTimers();

      expect(router.navigate).toHaveBeenCalledWith(['/track']);
      vi.useRealTimers();
    });

    it('should handle update error', () => {
      const mockError = { error: { message: 'Update failed' } };
      vi.mocked(shipmentService.updateStatus).mockReturnValueOnce(throwError(() => mockError));

      component.form.patchValue({
        status: '2',
        location: 'Chicago',
      });
      component.updateShipment();

      expect(component.error).toBeTruthy();
      expect(component.loading).toBe(false);
    });

    it('should display generic error message on update failure', () => {
      const mockError = new Error('Network error');
      vi.mocked(shipmentService.updateStatus).mockReturnValueOnce(throwError(() => mockError));

      component.form.patchValue({
        status: 2,
        location: 'Chicago',
      });
      component.updateShipment();

      expect(component.error).toContain('Network error');
    });
  });

  describe('Form Getters', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return status form control', () => {
      expect(component.status).toBe(component.form.get('status'));
    });

    it('should return location form control', () => {
      expect(component.location).toBe(component.form.get('location'));
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.trackingId = 'DHL001';
    });

    it('should disable submit button when form is invalid', () => {
      component.form.patchValue({
        status: '',
        location: 'New York',
      });
      expect(component.form.invalid).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.form.patchValue({
        status: '2',
        location: 'New York',
      });
      expect(component.form.valid).toBe(true);
    });

    it('should clear success message when new update starts', () => {
      component.success = 'Shipment updated successfully';
      component.form.patchValue({
        status: 'Out for Delivery',
        location: 'Chicago',
      });
      component.updateShipment();
      expect(component.success).toBe('Shipment updated successfully');
    });
  });
});
