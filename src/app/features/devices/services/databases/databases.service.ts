import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../users/models/apiResponse.interface';
import { HttpClient } from '@angular/common/http';

@Service()
export class DatabasesService {
  apiUrl = environment.apiUrlGateway;
  apiName = 'adminmanager/user/databases';
  prefix = '';

  private http = inject(HttpClient);
  constructor() {}

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.apiName}`);
  }
}
