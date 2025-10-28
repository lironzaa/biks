import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { ErrorInput } from '../error-input/error-input';
import { CustomErrorMessages } from '../../../types/inputs/error-input/custom-error-messages.type';

@Component({
  selector: 'app-range-date-input',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSuffix,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatIcon,
    ErrorInput
  ],
  templateUrl: './range-date-input.html',
  styleUrl: './range-date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeDateInput {
  formGroup = input.required<FormGroup>();
  startDateControl = input.required<FormControl<string | Date | null>>();
  endDateControl = input.required<FormControl<string | Date | null>>();
  name = input.required<string>();
  label = input<string>('Date Range');
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);
}