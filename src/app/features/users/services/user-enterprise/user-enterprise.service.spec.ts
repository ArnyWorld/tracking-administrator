import { TestBed } from '@angular/core/testing';

import { UserEnterpriseService } from './user-enterprise.service';

describe('UserEnterpriseService', () => {
  let service: UserEnterpriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEnterpriseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
