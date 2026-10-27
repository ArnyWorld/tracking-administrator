import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let request = req;

  if (!req.headers.has('Authorization')) {
    const token = authService.getToken();

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.clearSession();
        void router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    }),
  );
};
