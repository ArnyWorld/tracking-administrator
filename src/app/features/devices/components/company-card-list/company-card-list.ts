import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Company } from '../../models/company.interface';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';

@Component({
  selector: 'app-company-card-list',
  imports: [
    DatePipe,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './company-card-list.html',
  styleUrl: './company-card-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyCardListComponent {
  private confirmService = inject(ConfirmService);
  readonly companies = input.required<Company[]>();
  readonly selected = output<Company>();

  protected readonly visible = computed(() => this.companies().filter((c) => !c.deleted));

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }

  /** Devuelve blanco u oscuro según la luminancia del color de fondo. */
  protected textOn(hex: string): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#111827' : '#ffffff';
  }

  public selectedCompany = (company: Company) => {
    console.log(company);
    this.confirmService.confirm(
      async () => {
        const companyData = {
          id: company?.id,
          codename: company?.databases[0]?.codename,
          name: company?.name,
          image: company?.image,
        };
        console.log('companyData: ', companyData);
        localStorage.setItem('company', JSON.stringify(companyData));
        window.location.reload();
      },
      {
        title: 'Gestión de Empresa',

        content: `
          ¿Estás seguro de que desea seleccionar la empresa: ${company?.name}?
        `,

        danger: false,
      },
    );
  };
}
