import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MonitorComponent } from "./components/monitor/monitor.component";
import { SharedModule } from "../../shared/shared.module";
import { MonitorModuleRoutingModule } from "./monitor-routing.module";

@NgModule({
  declarations: [
    MonitorComponent
  ],
  imports: [
    CommonModule,
    MonitorModuleRoutingModule,
    SharedModule
  ]
})
export class MonitorModule {
}
