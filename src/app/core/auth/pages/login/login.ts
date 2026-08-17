import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
 private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);
  readonly loginError = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  login(): void {
    this.loginError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loading()) {
      return;
    }

    const credentials = this.loginForm.getRawValue();

    console.log('Login:', {
      username: credentials.username,
      rememberMe: credentials.rememberMe
    });

    this.loading.set(true);

    /*
     * ==========================================================
     * AUTENTICACIÓN
     * ==========================================================
     *
     * Cuando conectes el backend, reemplaza esta simulación por:
     *
     * this.authService.login(credentials).subscribe({
     *   next: () => {
     *     this.router.navigate(['/app']);
     *   },
     *   error: (error) => {
     *     this.loginError.set(
     *       error?.error?.message ??
     *       'Usuario o contraseña incorrectos.'
     *     );
     *
     *     this.loading.set(false);
     *   }
     * });
     *
     */

    setTimeout(() => {
      this.loading.set(false);

      // Para probar un error:
      // this.loginError.set('Usuario o contraseña incorrectos.');

      // Para probar navegación:
      // this.router.navigate(['/app']);
    }, 1500);
  }

}
