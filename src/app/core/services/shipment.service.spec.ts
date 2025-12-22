import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShipmentService } from './shipment.service';
import { Shipment } from '../models/shipment.model';

describe('ShipmentService', () => {
  let service: ShipmentService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:5108/api';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShipmentService],
    });
    service = TestBed.inject(ShipmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('trackShipment', () => {
    it('should fetch shipment by tracking ID', () => {
      const trackingId = 'DHL123456';

      service.trackShipment(trackingId).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockShipment);
    });

    it('should return shipment data on successful request', () => {
      const trackingId = 'DHL123456';
      let result: Shipment | undefined;

      service.trackShipment(trackingId).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}`);
      req.flush(mockShipment);

      expect(result).toEqual(mockShipment);
    });

    it('should handle tracking ID with special characters', () => {
      const trackingId = 'DHL-123-456';

      service.trackShipment(trackingId).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockShipment);
    });

    it('should handle shipment not found error', () => {
      const trackingId = 'INVALID';
      let errorOccurred = false;

      service.trackShipment(trackingId).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}`);
      req.error(new ErrorEvent('Not Found'), { status: 404 });

      expect(errorOccurred).toBe(true);
    });

    it('should handle server errors gracefully', () => {
      const trackingId = 'DHL123456';
      let errorOccurred = false;

      service.trackShipment(trackingId).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}`);
      req.error(new ErrorEvent('Server Error'), { status: 500 });

      expect(errorOccurred).toBe(true);
    });
  });

  describe('createShipment', () => {
    it('should create a new shipment', () => {
      const payload = {
        origin: 'Delhi',
        destination: 'London',
        estimatedDeliveryDate: '2025-02-01',
      };

      service.createShipment(payload).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/shipment/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockShipment);
    });

    it('should return created shipment', () => {
      const payload = {
        origin: 'Delhi',
        destination: 'London',
        estimatedDeliveryDate: '2025-02-01',
      };
      let result: Shipment | undefined;

      service.createShipment(payload).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne(`${baseUrl}/shipment/create`);
      req.flush(mockShipment);

      expect(result).toEqual(mockShipment);
    });

    it('should validate required fields', () => {
      const payload = {
        origin: 'Delhi',
        destination: 'London',
        estimatedDeliveryDate: '2025-02-01',
      };

      service.createShipment(payload).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/shipment/create`);
      expect(req.request.body.origin).toBeDefined();
      expect(req.request.body.destination).toBeDefined();
      expect(req.request.body.estimatedDeliveryDate).toBeDefined();
      req.flush(mockShipment);
    });

    it('should handle validation errors on create', () => {
      const payload = {
        origin: '',
        destination: 'London',
        estimatedDeliveryDate: '2025-02-01',
      };
      let errorOccurred = false;

      service.createShipment(payload).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/shipment/create`);
      req.error(new ErrorEvent('Bad Request'), { status: 400 });

      expect(errorOccurred).toBe(true);
    });
  });

  describe('updateStatus', () => {
    it('should update shipment status', () => {
      const trackingId = 'DHL123456';
      const payload = {
        status: 'Delivered',
        location: 'Berlin',
      };

      service.updateStatus(trackingId, payload).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}/status`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(mockShipment);
    });

    it('should return updated shipment', () => {
      const trackingId = 'DHL123456';
      const payload = {
        status: 'Delivered',
        location: 'Berlin',
      };
      let result: Shipment | undefined;

      service.updateStatus(trackingId, payload).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}/status`);
      req.flush(mockShipment);

      expect(result).toEqual(mockShipment);
    });

    it('should handle update errors', () => {
      const trackingId = 'DHL123456';
      const payload = {
        status: 'Delivered',
        location: 'Berlin',
      };
      let errorOccurred = false;

      service.updateStatus(trackingId, payload).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/shipment/${trackingId}/status`);
      req.error(new ErrorEvent('Unauthorized'), { status: 401 });

      expect(errorOccurred).toBe(true);
    });
  });
});
