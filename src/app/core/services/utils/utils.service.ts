import { Service } from '@angular/core';
import { ApiResponse } from '../../../features/users/models/apiResponse.interface';

@Service()
export class UtilsService {
  getResponseGeneral = (data: ApiResponse) => {
    return data.content || data.data || [];
  };
}
