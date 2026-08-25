import { TestBed } from '@angular/core/testing';

import { AssignmentDeviceService } from './assignment-device.service';

describe('AssignmentDeviceService', () => {
  let service: AssignmentDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
