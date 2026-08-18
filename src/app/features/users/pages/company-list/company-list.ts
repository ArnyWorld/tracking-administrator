import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CompanyService } from '../../services/company/company.service';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { DataTableColumn } from '../../../../core/models/table-column.interface';
import { PageEvent } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/data-table/data-table';

@Component({
  selector: 'app-company-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTableComponent],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
})
export class CompanyList implements AfterViewInit {
  private companyService = inject(CompanyService);

  private uiUtilsService = inject(UiUtilsService);

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
      /*  {
        key: 'id',
        label: '#',
        width: '70px',
        align: 'center',
      },
 */
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
}
