import { TestBed } from '@angular/core/testing';

import { DeviceVehicleService } from './device-vehicle.service';

describe('DeviceVehicleService', () => {
  let service: DeviceVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
