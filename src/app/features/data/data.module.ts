import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataComponent } from "./components/data/data.component";
import { DataRoutingModule } from "./data-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { TraineeFormComponent } from "./components/trainee-form/trainee-form.component";
import { DataTableWrapperComponent } from "./components/data-table-wrapper/data-table-wrapper.component";

@NgModule({
  declarations: [
    DataComponent,
    TraineeFormComponent,
    DataTableWrapperComponent,
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    SharedModule
  ]
})
export class DataModule {
}
