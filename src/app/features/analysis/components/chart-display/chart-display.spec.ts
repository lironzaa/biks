import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDisplay } from './chart-display';

describe('ChartDisplay', () => {
  let component: ChartDisplay;
  let fixture: ComponentFixture<ChartDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
