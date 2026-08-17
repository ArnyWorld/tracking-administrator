import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import {
  LoginCredentials,
  LoginResponse,
  AuthUser,
  StoredSession,
} from '../../auth/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly loginUrl = '/api/auth/login';

  private readonly localStorageKey = 'kernotracking_auth';
  private readonly sessionStorageKey = 'kernotracking_auth';

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap((response) => {
        this.storeSession(response, credentials.rememberMe);
      }),
    );
  }

  logout(): void {
    this.clearSession();

    void this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    const session = this.getStoredSession();

    return session?.token ?? null;
  }

  getCurrentUser(): AuthUser | null {
    const session = this.getStoredSession();

    return session?.user ?? null;
  }

  clearSession(): void {
    localStorage.removeItem(this.localStorageKey);
    sessionStorage.removeItem(this.sessionStorageKey);
  }

  private storeSession(response: LoginResponse, rememberMe: boolean): void {
    const session: StoredSession = {
      token: response.token,
      user: response.user,
    };

    const serializedSession = JSON.stringify(session);

    this.clearSession();

    if (rememberMe) {
      localStorage.setItem(this.localStorageKey, serializedSession);

      return;
    }

    sessionStorage.setItem(this.sessionStorageKey, serializedSession);
  }

  private getStoredSession(): StoredSession | null {
    const sessionData =
      sessionStorage.getItem(this.sessionStorageKey) ?? localStorage.getItem(this.localStorageKey);

    if (!sessionData) {
      return null;
    }

    try {
      return JSON.parse(sessionData) as StoredSession;
    } catch {
      this.clearSession();

      return null;
    }
  }
}
