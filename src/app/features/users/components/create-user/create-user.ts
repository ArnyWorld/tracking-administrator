import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { UserService } from '../../services/user/user.service';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-user',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUserComponent {
  private readonly fb = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmService);
  private readonly uiUtils = inject(UiUtilsService);
  private readonly userService = inject(UserService);
  private router = inject(Router);

  readonly completed = output<void>();

  readonly formUser = this.fb.nonNullable.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    username: ['', Validators.required],
    password: ['', Validators.required],
    type: ['personal', Validators.required],
  });

  action = 'Registro de';

  isLoading = false;

  saveUser(): void {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();

      this.uiUtils.warning('Complete los campos obligatorios.');

      return;
    }

    this.isLoading = true;

    const user = this.formUser.getRawValue();

    this.userService.register(user).subscribe({
      next: (data: any) => {
        localStorage.setItem('tokenUser', data?.token);

        localStorage.setItem('typeUser', user.type);

        this.isLoading = false;

        this.uiUtils.success('Se registró correctamente el usuario.');

        this.completed.emit();
      },

      error: () => {
        this.isLoading = false;

        this.uiUtils.error('No se registró el usuario.');
      },
    });
  }

  showConfirm(): void {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();

      this.uiUtils.warning('Complete los campos obligatorios.');

      return;
    }

    this.confirmService.confirm(() => this.saveUser(), {
      title: 'Registro de Usuario',
      content: `¿Está seguro de que desea registrar al usuario ${this.formUser.controls.name.value}?`,
      danger: false,
    });
  }

  cancel(): void {
    this.router.navigate(['/app/user/list']);
  }
}
