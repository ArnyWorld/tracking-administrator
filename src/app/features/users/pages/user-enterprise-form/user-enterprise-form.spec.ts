import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEnterpriseForm } from './user-enterprise-form';

describe('UserEnterpriseForm', () => {
  let component: UserEnterpriseForm;
  let fixture: ComponentFixture<UserEnterpriseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEnterpriseForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEnterpriseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
