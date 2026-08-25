import { TestBed } from '@angular/core/testing';

import { GpsSensorService } from './gps-sensor.service';

describe('GpsSensorService', () => {
  let service: GpsSensorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpsSensorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
