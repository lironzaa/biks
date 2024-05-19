import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { ToastrModule } from "ngx-toastr";
import { MatIcon } from "@angular/material/icon";
import { HttpClientModule } from "@angular/common/http";

import { HeaderComponent } from "./components/layout/header/header.component";
import { TraineesEffects } from "../features/data/store/trainees.effects";
import { appReducer } from "./store/app.reducer";

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
    MatIcon,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([ TraineesEffects ]),
  ]
})
export class CoreModule {
}
