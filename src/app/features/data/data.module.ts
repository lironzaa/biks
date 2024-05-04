import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataComponent } from "./components/data/data.component";
import { DataRoutingModule } from "./data-routing.module";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    DataComponent
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    SharedModule
  ]
})
export class DataModule {
}
