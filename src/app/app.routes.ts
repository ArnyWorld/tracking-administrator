import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      /* {
        path: 'dashboard',
        loadComponent: () =>
          import('./core/auth/pages/dashboard/dashboard').then(
            m => m.Dashboard
          )
      }, */

      {
        path: 'user',
        loadChildren: () => import('./features/users/user.routes').then((m) => m.USER_ROUTES),
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },

  {
    path: '**',
    redirectTo: 'app/dashboard',
  },
];
