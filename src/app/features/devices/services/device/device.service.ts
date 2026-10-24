import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../users/models/apiResponse.interface';
import { Observable } from 'rxjs';
import { CreateDeviceRequest, DeviceRequest } from '../../models/device.interface';

@Service()
export class DeviceService {
  apiUrl = environment.apiUrl;
  apiUrl2 = environment.wsapiserver;
  apiName = 'devices';
  apiNameGateway = 'gateway/devices';
  prefix = '';
  db = JSON.parse(localStorage.getItem('company')!)?.codename ?? null;

  private http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.db}/${this.apiName}`);
  }

  getAllDevicesGateway(): Observable<any> {
    return this.http.get<ApiResponse>(
      this.apiUrl2 + this.prefix + `/${this.db}/${this.apiNameGateway}`,
    );
  }

  getAllDevicesWithImei(db: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${db}/${this.apiName}`);
    /* .pipe(
        map((response) => ({
          ...response,
          content: response.content.filter((device) => device.imei != null),
        })),
      ); */
  }

  findDeviceByImei = (imei: string): Observable<any> => {
    return this.http.get<ApiResponse>(
      this.apiUrl2 + this.prefix + `/${this.apiNameGateway}?imei=${imei}`,
    );
  };

  register(data: DeviceRequest, db: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrl + this.prefix + `/${db}/${this.apiName}/registry`,
      data,
    );
  }
}
