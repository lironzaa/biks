import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeForm } from './trainee-form';

describe('TraineeForm', () => {
  let component: TraineeForm;
  let fixture: ComponentFixture<TraineeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
