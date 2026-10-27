import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../users/models/apiResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class GpsspecsService {
  apiUrl = environment.apiTest;
  apiName = 'gpsspecs';
  prefix = '';

  private http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.apiName}`);
  }
}
