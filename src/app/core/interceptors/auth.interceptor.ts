import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  /*
   * Si no hay token, la petición continúa
   * normalmente.
   */
  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.clearSession();

        void router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    }),
  );
};
