import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  AuthSession,
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from '../../auth/models/auth.models';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly loginUrl = environment.apiUrlLoginGateway;
  private apiName = 'login';

  private readonly storageKey = 'gps_auth_session';

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.loginUrl}/${this.apiName}`, {
        username: credentials.username,
        password: credentials.password,
      })
      .pipe(
        tap((response) => {
          if (!response.success || !response.token) {
            throw new Error('La autenticación no devolvió un token válido.');
          }

          const user = this.decodeToken(response.token);

          const session: AuthSession = {
            token: response.token,
            expires: response.expires,
            user,
          };

          this.storeSession(session, credentials.rememberMe);
        }),
      );
  }

  logout(): void {
    this.clearSession();

    void this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const session = this.getSession();

    if (!session) {
      return false;
    }

    if (this.isSessionExpired(session)) {
      this.clearSession();

      return false;
    }

    return true;
  }

  getToken(): string | null {
    const session = this.getSession();

    if (!session) {
      return null;
    }

    if (this.isSessionExpired(session)) {
      this.clearSession();

      return null;
    }

    return session.token;
  }

  getCurrentUser(): AuthUser | null {
    const session = this.getSession();

    if (!session) {
      return null;
    }

    if (this.isSessionExpired(session)) {
      this.clearSession();

      return null;
    }
    console.log('session.user', session.user);
    return session.user;
  }

  getExpiration(): number | null {
    return this.getSession()?.expires ?? null;
  }

  getSession(): AuthSession | null {
    const sessionData =
      sessionStorage.getItem(this.storageKey) ?? localStorage.getItem(this.storageKey);

    if (!sessionData) {
      return null;
    }

    try {
      return JSON.parse(sessionData) as AuthSession;
    } catch {
      this.clearSession();

      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.storageKey);

    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem('tokenUser');
    sessionStorage.removeItem('typeUser');
  }

  private storeSession(session: AuthSession, rememberMe: boolean): void {
    this.clearSession();

    const serializedSession = JSON.stringify(session);

    if (rememberMe) {
      localStorage.setItem(this.storageKey, serializedSession);

      return;
    }

    sessionStorage.setItem(this.storageKey, serializedSession);
  }

  private isSessionExpired(session: AuthSession): boolean {
    return Date.now() >= session.expires;
  }

  private decodeToken(token: string): AuthUser {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('El token recibido no tiene formato JWT válido.');
    }

    const payload = parts[1];

    const decodedPayload = this.decodeBase64Url(payload);

    const user = JSON.parse(decodedPayload) as AuthUser;

    return user;
  }

  private decodeBase64Url(value: string): string {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');

    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

    const binary = atob(padded);

    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return new TextDecoder().decode(bytes);
  }
}
