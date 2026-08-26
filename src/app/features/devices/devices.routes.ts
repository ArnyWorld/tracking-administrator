import { Routes } from '@angular/router';

export const DEVICE_ROUTES: Routes = [
  /* {
    path: '',
    loadComponent: () => import('./pages/user-form/user-form').then((m) => m.UserForm),
  }, */

  {
    path: 'create',
    loadComponent: () => import('./pages/device-form/device-form').then((m) => m.DeviceForm),
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/device-list/device-list').then((m) => m.DeviceList),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/device-form/device-form').then((m) => m.DeviceForm),
  },
];
