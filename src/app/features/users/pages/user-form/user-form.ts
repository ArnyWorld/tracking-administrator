import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CreateUserComponent } from '../../components/create-user/create-user';
import CreateCompanyComponent from '../../components/create-company/create-company';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-form',
  imports: [MatButtonModule, MatStepperModule, CreateUserComponent, CreateCompanyComponent],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly current = signal(0);

  readonly currentUser = this.authService.getCurrentUser();

  readonly isAdmin = this.currentUser?.user?.type === 'admin';

  next(): void {
    if (!this.isAdmin) {
      this.finish();
      return;
    }

    this.current.update((value) => Math.min(value + 1, 1));
  }

  previous(): void {
    this.current.update((value) => Math.max(0, value - 1));
  }

  finish(): void {
    this.router.navigate(['/app/user/company-list']);
  }

  finishUserCreation(): void {
    if (this.isAdmin) {
      this.next();
      return;
    }

    this.router.navigate(['/app/user/list']);
  }
}
