import { Component, inject, signal } from '@angular/core';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { CompanyCardListComponent } from '../../components/company-card-list/company-card-list';

import { CompanyService } from '../../../devices/services/company/company.service';
import { CommonModule } from '@angular/common';
import { Company } from '../../../devices/models/company.interface';

@Component({
  selector: 'app-home',
  imports: [CompanyCardListComponent, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private companiesService = inject(CompanyService);
  private readonly ui = inject(UiUtilsService);

  companies = signal<Company[]>([]);

  ngOnInit() {
    this.getCompanies();
  }

  private getCompanies = () => {
    this.companiesService.getAll().subscribe({
      next: (data) => {
        this.companies.set(data.content);
      },
      error: (err) => {
        this.ui.error('No se pudieron recuperar las empresas.');
      },
    });
  };

  public onSelect = (data: any) => {
    console.log('data received: ', data);
  };
}
