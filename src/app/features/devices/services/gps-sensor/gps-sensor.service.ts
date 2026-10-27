import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../users/models/apiResponse.interface';

@Service()
export class GpsSensorService {
  apiUrl = environment.apiTest;
  apiName = 'gpsspec_sensors';
  prefix = '';

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
    return this.http.get(this.apiUrl + this.prefix + `/${this.apiName}?gpsspec_id[equal]=${id}`);
  }

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.apiName}`);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + this.prefix + `/${this.apiName}/${id}`);
  }
}
