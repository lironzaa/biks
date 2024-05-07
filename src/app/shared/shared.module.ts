import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { BaseChartDirective } from "ng2-charts";

import { TextInputComponent } from "./components/inputs/text-input/text-input.component";
import { DataTableComponent } from "./components/tables/data-table/data-table.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { PaginationComponent } from "./components/tables/pagination/pagination.component";
import { AppButtonComponent } from "./components/button/app-button/app-button.component";
import { TableFiltersComponent } from "./components/tables/table-filters/table-filters.component";
import { ErrorInputComponent } from "./components/inputs/error-input/error-input.component";
import { SelectInputComponent } from "./components/inputs/select-input/select-input.component";
import { DateInputComponent } from "./components/inputs/date-input/date-input.component";
import { ChartComponent } from "./components/charts/chart/chart.component";

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
    SelectInputComponent,
    DateInputComponent,
    ChartComponent,
  ],
  exports: [
    DataTableComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    TextInputComponent,
    AppButtonComponent,
    SelectInputComponent,
    DateInputComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective,

    // Mat Modules
    MatLabel,
    MatFormField,
    MatProgressSpinner,
    MatButton,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatHint,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" }
  ]
})
export class SharedModule {
}
