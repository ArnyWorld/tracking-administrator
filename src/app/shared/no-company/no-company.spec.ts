import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCompany } from './no-company';

describe('NoCompany', () => {
  let component: NoCompany;
  let fixture: ComponentFixture<NoCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(NoCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
