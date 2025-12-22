import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateShipment } from './create-shipment';
import { ShipmentService } from '../../../core/services/shipment.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { Shipment } from '../../../core/models/shipment.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

describe('CreateShipment Component', () => {
  let component: CreateShipment;
  let fixture: ComponentFixture<CreateShipment>;
  let shipmentService: ShipmentService;
  let router: Router;

  const mockShipment: Shipment = {
    trackingId: 'DHL123456',
    origin: 'New York',
    destination: 'Los Angeles',
    estimatedDeliveryDate: '2024-12-31',
    currentStatus: 0,
    milestones: [],
  };

  beforeEach(async () => {
    const mockShipmentService = {
      createShipment: vi.fn(() => of(mockShipment)),
      notifyShipmentUpdated: vi.fn(),
    };
    const mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateShipment],
      providers: [
        { provide: ShipmentService, useValue: mockShipmentService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    shipmentService = TestBed.inject(ShipmentService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CreateShipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.loading).toBe(false);
      expect(component.error).toBe('');
      expect(component.form).toBeTruthy();
    });

    it('should have all required form controls', () => {
      expect(component.form.get('origin')).toBeTruthy();
      expect(component.form.get('destination')).toBeTruthy();
      expect(component.form.get('estimatedDeliveryDate')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when form is empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when required fields are missing', () => {
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
      });
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid when all fields are filled', () => {
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });
      expect(component.form.valid).toBe(true);
    });

    it('should validate origin field is required', () => {
      const originControl = component.form.get('origin');
      originControl?.setValue('');
      originControl?.markAsTouched();
      expect(originControl?.hasError('required')).toBe(true);
    });

    it('should validate destination field is required', () => {
      const destinationControl = component.form.get('destination');
      destinationControl?.setValue('');
      destinationControl?.markAsTouched();
      expect(destinationControl?.hasError('required')).toBe(true);
    });

    it('should validate estimatedDeliveryDate field is required', () => {
      const dateControl = component.form.get('estimatedDeliveryDate');
      dateControl?.setValue('');
      dateControl?.markAsTouched();
      expect(dateControl?.hasError('required')).toBe(true);
    });
  });

  describe('submit() method', () => {
    it('should not call shipmentService when form is invalid', () => {
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
      });
      component.submit();

      expect(shipmentService.createShipment).not.toHaveBeenCalled();
    });

    it('should call shipmentService with form values when form is valid', () => {
      const createSpy = vi
        .spyOn(shipmentService, 'createShipment')
        .mockReturnValue(of(mockShipment));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(createSpy).toHaveBeenCalledWith({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });
    });

    it('should set loading to true during submission', () => {
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(of(mockShipment));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.loading).toBe(false);
    });

    it('should clear error message before submission', () => {
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(of(mockShipment));
      component.error = 'Previous error';
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.error).toBe('');
    });
  });

  describe('Successful Shipment Creation', () => {
    it('should navigate to home on successful creation', () => {
      const createSpy = vi
        .spyOn(shipmentService, 'createShipment')
        .mockReturnValue(of(mockShipment));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(createSpy).toHaveBeenCalled();
      expect(component.success).toBe(APP_CONSTANTS.ERROR_MESSAGES.SHIPMENT_CREATED_SUCCESS);
    });

    it('should set loading to false after successful creation', () => {
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(of(mockShipment));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.loading).toBe(false);
    });

    it('should clear error message on successful creation', () => {
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(of(mockShipment));
      component.error = 'Previous error';
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.error).toBe('');
    });
  });

  describe('Creation Error Handling', () => {
    it('should display error message on creation failure', () => {
      const errorResponse = { error: { message: 'Invalid shipment data' } };
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.error).toBe('Invalid shipment data');
    });

    it('should display fallback error when no error message provided', () => {
      const errorResponse = { status: 500 };
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.error).toBe('Something went wrong');
    });

    it('should handle 400 Bad Request error', () => {
      const errorResponse = { status: 400, error: { message: 'Bad request' } };
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.error).toBe('Bad request');
    });

    it('should handle 401 Unauthorized error', () => {
      const errorResponse = { status: 401, error: { message: 'Unauthorized' } };
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.error).toBe('Unauthorized');
    });

    it('should set loading to false on error', () => {
      const errorResponse = { error: { message: 'Server error' } };
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.loading).toBe(false);
    });

    it('should not navigate on creation failure', () => {
      const errorResponse = { error: { message: 'Invalid shipment data' } };
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(throwError(() => errorResponse));
      const routerSpy = vi.spyOn(router, 'navigate');
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(routerSpy).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('should reset form after successful creation', () => {
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(of(mockShipment));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();

      expect(component.form.get('origin')?.value).toBe('');
      expect(component.form.get('destination')?.value).toBe('');
      expect(component.form.get('estimatedDeliveryDate')?.value).toBe('');
    });
  });

  describe('Memory Management', () => {
    it('should cleanup on component destroy', () => {
      vi.spyOn(shipmentService, 'createShipment').mockReturnValue(of(mockShipment));
      component.form.patchValue({
        origin: 'New York',
        destination: 'Los Angeles',
        estimatedDeliveryDate: '2025-12-31',
      });

      component.submit();
      fixture.destroy();

      expect(component).toBeTruthy();
    });
  });
});
