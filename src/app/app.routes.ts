import { Routes } from '@angular/router';
import { TrackShipment } from './features/tracking/track-shipment/track-shipment';
import { CreateShipment } from './features/admin/create-shipment/create-shipment';
import { UpdateShipment } from './features/admin/update-shipment/update-shipment';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'track', component: TrackShipment, canActivate: [authGuard] },
  {
    path: 'admin/create',
    component: CreateShipment,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/update/:id',
    component: UpdateShipment,
    canActivate: [adminGuard],
  },
];
