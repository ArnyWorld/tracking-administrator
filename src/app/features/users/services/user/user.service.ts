import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../models/apiResponse.interface';
import { UserRequest } from '../../models/userRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrlGateway;
  private readonly apiName = 'adminmanager/user';

  private prefix = '';

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  register(data: UserRequest | any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.getUrl(), data);
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
