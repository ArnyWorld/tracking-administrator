import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ApiResponse } from '../../models/apiResponse.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { CompanyRequest } from '../../models/companyRequest.interface';

@Service()
export class CompanyService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrlGateway;

  private readonly apiName = 'adminmanager/user/enterprises';

  private prefix = '';

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  register(data: CompanyRequest): Observable<ApiResponse> {
    const token = localStorage.getItem('tokenUser');

    if (!token) {
      throw new Error('No existe un token de registro válido.');
    }

    return this.http.post<ApiResponse>(this.getUrl(), data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAllPaginate(
    page: number,
    pageSize: number,
    sortBy: string = 'id',
    descending: boolean = false,
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.getUrl(), {
      params: {
        page,
        size: pageSize,
        sortBy,
        descending,
      },
    });
  }

  private getUrl(): string {
    return `${this.apiUrl}${this.prefix}/${this.apiName}`;
  }
}
