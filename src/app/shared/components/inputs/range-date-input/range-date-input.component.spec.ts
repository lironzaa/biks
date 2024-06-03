import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RangeDateInputComponent } from "./range-date-input.component";

describe("RangeDateInputComponent", () => {
  let component: RangeDateInputComponent;
  let fixture: ComponentFixture<RangeDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RangeDateInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RangeDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
