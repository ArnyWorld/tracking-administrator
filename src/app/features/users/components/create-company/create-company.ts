import { Component, inject, OnInit, output } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { catchError, forkJoin, of } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';

import { MatChipsModule } from '@angular/material/chips';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { CompanyService } from '../../services/company/company.service';

@Component({
  selector: 'app-create-company',
  imports: [
    ReactiveFormsModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './create-company.html',
  styleUrl: './create-company.css',
})
export default class CreateCompanyComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly confirmService = inject(ConfirmService);

  private readonly uiUtils = inject(UiUtilsService);

  private readonly companyService = inject(CompanyService);

  readonly completed = output<void>();

  isLoading = false;

  type = 'personal';

  previewImage: string | null = null;

  companyForm = this.fb.group({
    companies: this.fb.array<FormGroup>([]),
  });

  constructor() {
    this.addCompany();
  }

  ngOnInit(): void {
    this.type = localStorage.getItem('typeUser') ?? 'personal';
  }

  get companies(): FormArray<FormGroup> {
    return this.companyForm.controls.companies;
  }

  createCompanyGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],

      codename: ['', Validators.required],

      description: [''],

      color: ['#1677ff', Validators.required],

      image: [null, Validators.required],
    });
  }

  addCompany(): void {
    this.companies.push(this.createCompanyGroup());
  }

  removeCompany(index: number): void {
    this.confirmService.confirm(
      () => {
        this.companies.removeAt(index);
      },
      {
        title: 'Eliminar empresa',
        content: '¿Está seguro?',
        danger: true,
      },
    );
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.uiUtils.warning('Seleccione una imagen válida.');

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      this.companies.at(index).patchValue({
        image: base64,
      });

      this.previewImage = base64;
    };

    reader.readAsDataURL(file);
  }

  showConfirm(): void {
    this.companyForm.markAllAsTouched();

    if (this.companyForm.invalid) {
      this.uiUtils.warning('Complete los campos obligatorios.');

      return;
    }

    this.confirmService.confirm(() => this.saveCompanies(), {
      title: 'Registro de empresas',

      content: `Se registrarán ${this.companies.length} empresas.
¿Desea continuar?`,

      danger: false,
    });
  }

  private saveCompanies(): void {
    const tokenUser = localStorage.getItem('tokenUser');

    if (!tokenUser) {
      this.uiUtils.error('No existe un usuario registrado.');

      return;
    }

    this.isLoading = true;

    const requests = this.companies.controls.map((company) =>
      this.companyService.register(company.getRawValue()).pipe(
        catchError(() =>
          of({
            error: true,
            company: company.get('name')?.value,
          }),
        ),
      ),
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const errors = results.filter((result: any) => result.error);

        this.isLoading = false;

        if (errors.length === 0) {
          this.uiUtils.success('Todas las empresas fueron registradas.');

          this.completed.emit();

          return;
        }

        this.uiUtils.warning(`${errors.length} empresas no pudieron registrarse.`);
      },

      error: () => {
        this.isLoading = false;

        this.uiUtils.error('Ocurrió un error al registrar las empresas.');
      },
    });
  }

  cancel(): void {
    void this.router.navigate(['/list-company']);
  }
}
