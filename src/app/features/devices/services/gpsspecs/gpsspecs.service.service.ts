import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../users/models/apiResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class GpsspecsService {
  apiUrl = environment.apiUrl;
  apiName = 'gpsspecs';
  prefix = '';
  db = JSON.parse(localStorage.getItem('company')!)?.codename ?? null;

  private http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.db}/${this.apiName}`);
  }
}
