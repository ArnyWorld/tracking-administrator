import { Component, inject, signal } from '@angular/core';
import { CompanyService } from '../../services/company/company.service';
import { CompaniesResponse, Company } from '../../models/company.interface';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { CompanyCardListComponent } from '../../components/company-card-list/company-card-list';

@Component({
  selector: 'app-list-companies',
  imports: [CompanyCardListComponent],
  templateUrl: './list-companies.html',
  styleUrl: './list-companies.css',
})
export class ListCompanies {
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
