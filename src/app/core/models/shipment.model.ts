export interface ShipmentMilestone {
  status: string | number;
  location: string;
  timestamp: string;
}

export interface Shipment {
  trackingId: string;
  origin: string;
  destination: string;
  estimatedDeliveryDate: string;
  currentStatus: string | number;
  milestones: ShipmentMilestone[];
}
