import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeDateInput } from './range-date-input';

describe('RangeDateInput', () => {
  let component: RangeDateInput;
  let fixture: ComponentFixture<RangeDateInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeDateInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeDateInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
