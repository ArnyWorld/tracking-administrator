import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { CompanyRequest } from '../../../users/models/companyRequest.interface';
import { ApiResponse } from '../../../users/models/apiResponse.interface';

@Service()
export class CompanyService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrlGateway;

  private readonly apiName = 'adminmanager/user/enterprises';

  private prefix = '';

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  register(data: CompanyRequest, token: string): Observable<ApiResponse> {
    //const token = localStorage.getItem('tokenUser');

    if (!token) {
      throw new Error('No existe un token de registro válido.');
    }

    return this.http.post<ApiResponse>(this.getUrl(), data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.getUrl());
  }

  private getUrl(): string {
    return `${this.apiUrl}${this.prefix}/${this.apiName}`;
  }

  delete(id: string | number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}${this.prefix}/${this.apiName}/${id}`);
  }
}
