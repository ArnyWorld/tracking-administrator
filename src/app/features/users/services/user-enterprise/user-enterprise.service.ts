import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { UserByEnterpriseRequest } from '../../models/userByEnterprise.interface';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/apiResponse.interface';

@Service()
export class UserEnterpriseService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;
  private db = 'trackingdb';
  private prefix = '';

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  register(data: UserByEnterpriseRequest | any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.getUrl()}/${this.db}/users`, data);
  }

  getAllPaginate(
    page: number,
    pageSize: number,
    sortBy: string = 'id',
    descending: boolean = false,
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.getUrl() + 's', {
      params: {
        page,
        size: pageSize,
        sortBy,
        descending,
      },
    });
  }

  private getUrl(): string {
    return `${this.apiUrl}${this.prefix}/${this.apiUrl}`;
  }
}
