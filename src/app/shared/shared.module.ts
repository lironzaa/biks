import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { DataTableComponent } from './components/tables/data-table/data-table.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginationComponent } from './components/tables/pagination/pagination.component';
import { AppButtonComponent } from './components/button/app-button/app-button.component';

@NgModule({
  declarations: [
    TextInputComponent,
    DataTableComponent,
    SpinnerComponent,
    PaginationComponent,
    AppButtonComponent
  ],
  exports: [
    DataTableComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Mat Modules
    MatLabel,
    MatFormField,
    MatProgressSpinner,
    MatButton,
  ]
})
export class SharedModule {
}
