import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateDeviceRequest, Device, PaginatedResponse } from '../../models/device.interface';

@Service()
export class VehicleService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;
  private readonly apiName = 'vehicles';
  private prefix = '';
  private db: string | null = null;
  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  private get url(): string {
    return `${this.apiUrl}${this.prefix}/${this.db}/${this.apiName}`;
  }

  getAll(db: string): Observable<PaginatedResponse<Device>> {
    this.db = db;
    return this.http.get<PaginatedResponse<Device>>(this.url);
  }

  getAllPaginate(
    page: number,
    pageSize: number,
    sortBy = 'id',
    descending = false,
  ): Observable<PaginatedResponse<Device>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', pageSize)
      .set('sortBy', sortBy)
      .set('descending', descending);

    return this.http.get<PaginatedResponse<Device>>(this.url, {
      params,
    });
  }

  getById(id: string): Observable<PaginatedResponse<Device>> {
    return this.http.get<PaginatedResponse<Device>>(`${this.url}/${encodeURIComponent(id)}`);
  }

  create(data: CreateDeviceRequest): Observable<PaginatedResponse<Device>> {
    return this.http.post<PaginatedResponse<Device>>(this.url, data);
  }

  update(id: string, data: CreateDeviceRequest): Observable<PaginatedResponse<Device>> {
    return this.http.put<PaginatedResponse<Device>>(`${this.url}/${encodeURIComponent(id)}`, data);
  }

  delete(id: string): Observable<PaginatedResponse<void>> {
    return this.http.delete<PaginatedResponse<void>>(`${this.url}/${encodeURIComponent(id)}`);
  }
}
