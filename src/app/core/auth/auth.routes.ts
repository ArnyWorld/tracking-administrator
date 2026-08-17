import { Routes } from '@angular/router';

import { AuthLayout } from '../layout/auth-layout/auth-layout';
import { guestGuard } from '../guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
];
