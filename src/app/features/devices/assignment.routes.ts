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
    path: 'list',
    loadComponent: () =>
      import('./pages/assignment-list/assignment-list').then((m) => m.AssignmentList),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/assignment-form/device-form').then((m) => m.DeviceForm),
  },
];
