import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ApiResponse } from '../../models/apiResponse.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { CompanyRequest } from '../../models/companyRequest.interface';
import { Device } from '../../../devices/models/device.interface';

@Service()
export class CompanyService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrlGateway;

  private readonly apiName = 'adminmanager/user/enterprises';
  private readonly apiName2 = 'adminmanager/enterprise_devices';
  private readonly apiName3 = 'adminmanager/devices';

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

  registerDeviceInEnterprise(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.getUrl2(), data);
  }

  registerDeviceWithTimeZoneInEnterprise(data: Device): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.getUrl3(), data);
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

  private getUrl2(): string {
    return `${this.apiUrl}${this.prefix}/${this.apiName2}`;
  }

  private getUrl3(): string {
    return `${this.apiUrl}${this.prefix}/${this.apiName3}`;
  }

  delete(id: string | number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}${this.prefix}/${this.apiName}/${id}`);
  }
}
