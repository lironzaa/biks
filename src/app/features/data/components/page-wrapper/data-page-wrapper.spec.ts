import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPageWrapper } from './data-page-wrapper';

describe('DataPageWrapper', () => {
  let component: DataPageWrapper;
  let fixture: ComponentFixture<DataPageWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPageWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPageWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
