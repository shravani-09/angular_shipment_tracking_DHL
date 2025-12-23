import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, Subject, shareReplay, BehaviorSubject } from 'rxjs';
import { Shipment } from '../models/shipment.model';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private readonly baseUrl = 'http://localhost:5108/api';
  private shipmentUpdated$ = new Subject<void>();
  private adminShipmentCache$: Observable<Shipment[]> | null = null;
  private lastViewedTrackingId$ = new BehaviorSubject<string | null>(null);
  private lastViewedShipment$ = new BehaviorSubject<Shipment | null>(null);

  constructor(private http: HttpClient) {}

  getShipmentUpdatedNotifier(): Observable<void> {
    return this.shipmentUpdated$.asObservable();
  }

  notifyShipmentUpdated(): void {
    this.shipmentUpdated$.next();
  }

  trackShipment(trackingId: string): Observable<Shipment> {
    return this.http
      .get<Shipment>(`${this.baseUrl}/shipment/${trackingId}`)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  createShipment(payload: {
    origin: string;
    destination: string;
    estimatedDeliveryDate: string;
  }): Observable<Shipment> {
    return this.http
      .post<Shipment>(`${this.baseUrl}/shipment/create`, payload)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  updateStatus(
    trackingId: string,
    payload: { status: string | number; location: string }
  ): Observable<Shipment> {
    return this.http
      .put<Shipment>(`${this.baseUrl}/shipment/${trackingId}/status`, payload)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getAdminCreatedShipments(): Observable<Shipment[]> {
    if (!this.adminShipmentCache$) {
      this.adminShipmentCache$ = this.http.get<Shipment[]>(`${this.baseUrl}/shipment/view`).pipe(
        shareReplay(1),
        catchError((error: HttpErrorResponse) => {
          this.adminShipmentCache$ = null;
          return throwError(() => error);
        })
      );
    }
    return this.adminShipmentCache$;
  }

  clearAdminCache(): void {
    this.adminShipmentCache$ = null;
  }

  setLastViewedShipment(trackingId: string, shipment: Shipment): void {
    this.lastViewedTrackingId$.next(trackingId);
    this.lastViewedShipment$.next(shipment);
  }

  getLastViewedTrackingId(): Observable<string | null> {
    return this.lastViewedTrackingId$.asObservable();
  }

  getLastViewedShipment(): Observable<Shipment | null> {
    return this.lastViewedShipment$.asObservable();
  }

  clearLastViewedShipment(): void {
    this.lastViewedTrackingId$.next(null);
    this.lastViewedShipment$.next(null);
  }
}
