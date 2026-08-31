import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { Router } from '@angular/router';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { UserEnterpriseService } from '../../services/user-enterprise/user-enterprise.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-enterprise-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './user-enterprise-form.html',
  styleUrl: './user-enterprise-form.css',
})
export class UserEnterpriseForm {
  private readonly fb = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmService);
  private readonly uiUtils = inject(UiUtilsService);

  private readonly userEnterpriseService = inject(UserEnterpriseService);
  private router = inject(Router);

  readonly completed = output<void>();

  readonly formUser = this.fb.nonNullable.group({
    name: [null, Validators.required],
    password: [null, Validators.required],
    firstname: [null, Validators.required],
    lastname: [null, Validators.required],
    create_at: [Date.now(), [Validators.required]],
    update_at: [Date.now(), [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    state_id: [null, [Validators.required]],
    phone: [null],
  });
  hidePassword = true;

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

    this.userEnterpriseService.register(user).subscribe({
      next: (data: any) => {
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
