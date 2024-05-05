import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TraineeFormComponent } from "./trainee-form.component";

describe("TraineeFormComponent", () => {
  let component: TraineeFormComponent;
  let fixture: ComponentFixture<TraineeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraineeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraineeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
