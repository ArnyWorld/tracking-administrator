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
    path: 'company-list',
    loadComponent: () => import('./pages/company-list/company-list').then((m) => m.CompanyList),
  },
  {
    path: 'user-list',
    loadComponent: () => import('./pages/user-list/user-list').then((m) => m.UserList),
  },

  {
    path: ':id',
    loadComponent: () => import('./pages/user-form/user-form').then((m) => m.UserForm),
  },
];
