import { AfterViewInit, Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatTooltipModule } from '@angular/material/tooltip';

import { CompanyService } from '../../services/company/company.service';

import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';

import { DataTableColumn } from '../../../../core/models/table-column.interface';

import { PageEvent } from '@angular/material/paginator';

import { DataTableComponent } from '../../../../shared/data-table/data-table';

import { ConfirmService } from '../../../../core/services/confirm/confirm.service';

@Component({
  selector: 'app-company-list',

  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, DataTableComponent],

  templateUrl: './company-list.html',

  styleUrl: './company-list.css',
})
export class CompanyList implements AfterViewInit {
  private companyService = inject(CompanyService);

  private uiUtilsService = inject(UiUtilsService);

  private confirmService = inject(ConfirmService);

  private router = inject(Router);

  isLoading = signal(false);

  companies: Company[] = [];

  total = 0;

  pageIndex = 0;

  pageSize = 10;

  @ViewChild('logoTemplate')
  logoTemplate!: TemplateRef<unknown>;

  @ViewChild('colorTemplate')
  colorTemplate!: TemplateRef<unknown>;

  columns: DataTableColumn<Company>[] = [];

  ngAfterViewInit(): void {
    this.columns = [
      {
        key: 'name',
        label: 'Nombre',
      },

      {
        key: 'color',
        label: 'Color',
        template: this.colorTemplate,
      },

      {
        key: 'description',
        label: 'Descripción',
      },

      {
        key: 'image',
        label: 'Logo',
        width: '100px',
        align: 'center',
        template: this.logoTemplate,
      },
    ];

    this.getCompanies();
  }

  getCompanies(): void {
    this.isLoading.set(true);

    this.companyService.getAllPaginate(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.companies = response.content ?? [];

        this.total = response.pagination?.rowsNumber ?? 0;

        this.isLoading.set(false);
      },

      error: () => {
        this.isLoading.set(false);

        this.uiUtilsService.error('No se recuperaron las empresas registradas.');
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;

    this.getCompanies();
  }

  reload(): void {
    this.pageIndex = 0;

    this.getCompanies();
  }

  createUser(): void {
    this.router.navigate(['/app/user/create']);
  }

  editCompany(company: Company): void {
    this.router.navigate(['/app/company/edit', company.id]);
  }

  deleteCompany(company: Company): void {
    this.confirmService.confirm(() => this.removeCompany(company), {
      title: 'Eliminar empresa',

      content: `¿Está seguro de eliminar la empresa "${company.name}"?`,

      okText: 'Eliminar',

      cancelText: 'Cancelar',

      danger: true,
    });
  }

  private removeCompany(company: Company): void {
    this.isLoading.set(true);

    this.companyService.delete(company.id).subscribe({
      next: () => {
        this.uiUtilsService.success('Empresa eliminada correctamente.');

        this.getCompanies();
      },

      error: () => {
        this.isLoading.set(false);

        this.uiUtilsService.error('No fue posible eliminar la empresa.');
      },
    });
  }
  companyUsers(company: Company): void {
    this.router.navigate(['/app/user/create'], {
      queryParams: {
        companyId: company.id,
      },
    });
  }
}
