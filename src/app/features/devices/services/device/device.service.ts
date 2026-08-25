import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../users/models/apiResponse.interface';
import { Observable } from 'rxjs';
import { CreateDeviceRequest, DeviceRequest } from '../../models/device.interface';

@Service()
export class DeviceService {
  apiUrl = environment.apiTest;
  apiUrl2 = environment.wsapiserver;
  apiName = 'devices';
  apiNameGateway = 'gateway/devices';
  prefix = '';

  private http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.apiName}`);
  }
  getAllDevicesGateway(): Observable<any> {
    return this.http.get<ApiResponse>(this.apiUrl2 + this.prefix + `/${this.apiNameGateway}`);
  }

  getAllDevicesWithImei(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + this.prefix + `/${this.apiName}`);
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

  register(data: DeviceRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrl + this.prefix + `/${this.apiName}/registry`,
      data,
    );
  }
}
