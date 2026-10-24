import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../users/models/apiResponse.interface';

@Service()
export class DeviceVehicleService {
  apiUrl = environment.apiUrl;
  apiName = 'device_vehicle';
  prefix = '';
  db = JSON.parse(localStorage.getItem('company')!)?.codename ?? null;

  private http = inject(HttpClient);
  constructor() {}

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  register(datos: any): Observable<any> {
    return this.http.post(this.apiUrl + this.prefix + `/${this.apiName}`, datos);
  }

  update(datos: any, id: any): Observable<any> {
    return this.http.put(this.apiUrl + this.prefix + `/${this.apiName}/${id}`, datos);
  }

  find(id: string = ''): Observable<any> {
    return this.http.get(this.apiUrl + this.prefix + `/${this.apiName}/${id}`);
  }

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.db}/${this.apiName}`);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string = 'create_date',
    descending: boolean = true,
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      this.apiUrl +
        this.prefix +
        `/${this.db}/${this.apiName}?page=${page}&size=${size}&sortBy=${sortBy}&descending=${descending}`,
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + this.prefix + `/${this.apiName}/${id}`);
  }
}
