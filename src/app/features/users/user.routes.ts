import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/user-form/user-form').then((m) => m.UserForm),
  },

  {
    path: 'new',
    loadComponent: () => import('./pages/user-form/user-form').then((m) => m.UserForm),
  },

  {
    path: ':id',
    loadComponent: () => import('./pages/user-form/user-form').then((m) => m.UserForm),
  },
];
