import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCardList } from './company-card-list';

describe('CompanyCardList', () => {
  let component: CompanyCardList;
  let fixture: ComponentFixture<CompanyCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCardList],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyCardList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
