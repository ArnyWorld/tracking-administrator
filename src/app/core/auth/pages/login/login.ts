import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private authService = inject(AuthService);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);
  readonly loginError = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
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

    this.loading.set(true);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (!response.success) {
          this.loading.set(false);

          this.loginError.set('No fue posible iniciar sesión.');

          return;
        }

        void this.router.navigate(['app/home']);
      },

      error: (error) => {
        this.loading.set(false);

        this.loginError.set(error?.error?.message ?? 'Usuario o contraseña incorrectos.');
      },
    });
  }
}
