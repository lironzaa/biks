import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorInput } from './error-input';

describe('ErrorInput', () => {
  let component: ErrorInput;
  let fixture: ComponentFixture<ErrorInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ErrorInput]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
