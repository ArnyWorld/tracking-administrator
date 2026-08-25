import { Routes } from '@angular/router';

export const ASSIGNMENT_ROUTES: Routes = [
  /* {
    path: '',
    loadComponent: () => import('./pages/user-form/user-form').then((m) => m.UserForm),
  }, */

  {
    path: 'create',
    loadComponent: () => import('./pages/assignment-form/device-form').then((m) => m.DeviceForm),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/assignment-form/device-form').then((m) => m.DeviceForm),
  },
];
