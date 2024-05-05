import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatInput } from "@angular/material/input";

import { TextInputComponent } from "./components/inputs/text-input/text-input.component";
import { DataTableComponent } from "./components/tables/data-table/data-table.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { PaginationComponent } from "./components/tables/pagination/pagination.component";
import { AppButtonComponent } from "./components/button/app-button/app-button.component";
import { TableFiltersComponent } from "./components/tables/table-filters/table-filters.component";
import { ErrorInputComponent } from "./components/inputs/error-input/error-input.component";

import { AsStringPipe } from "./pipes/as-string.pipe";

@NgModule({
  declarations: [
    TextInputComponent,
    DataTableComponent,
    SpinnerComponent,
    PaginationComponent,
    AppButtonComponent,
    TableFiltersComponent,
    AsStringPipe,
    ErrorInputComponent,
  ],
  exports: [
    DataTableComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    TextInputComponent,
    AppButtonComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Mat Modules
    MatLabel,
    MatFormField,
    MatProgressSpinner,
    MatButton,
    MatInput,
  ]
})
export class SharedModule {
}
