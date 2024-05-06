import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataTableWrapperComponent } from "./data-table-wrapper.component";

describe("DataTableWrapperComponent", () => {
  let component: DataTableWrapperComponent;
  let fixture: ComponentFixture<DataTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
