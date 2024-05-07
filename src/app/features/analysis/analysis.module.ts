import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AnalysisComponent } from "./components/analysis/analysis.component";
import { AnalysisModuleRoutingModule } from "./analysis-routing.module";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    AnalysisComponent
  ],
  imports: [
    CommonModule,
    AnalysisModuleRoutingModule,
    SharedModule
  ]
})
export class AnalysisModule { }
