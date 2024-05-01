import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { DataTableComponent } from './components/tables/data-table/data-table.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginationComponent } from './components/tables/pagination/pagination.component';

@NgModule({
  declarations: [
    TextInputComponent,
    DataTableComponent,
    SpinnerComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Mat Modules
    MatLabel,
    MatFormField,
  ]
})
export class SharedModule {
}
