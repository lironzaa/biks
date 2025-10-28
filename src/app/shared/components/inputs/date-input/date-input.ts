import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { ControlValueAccessorDirective } from '../../../directives/input.directive';
import { CustomErrorMessages } from '../../../types/inputs/error-input/custom-error-messages.type';
import { ErrorInput } from '../error-input/error-input';

@Component({
  selector: 'app-date-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInput),
      multi: true,
    },
  ],
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ErrorInput,
    MatFormField,
    MatHint,
    MatLabel,
    MatSuffix,
    MatDatepickerToggle,
    MatIcon,
    MatDatepicker,
    MatDatepickerToggleIcon,
    MatInput,
    MatDatepickerInput,
    MatError,
    MatIconButton,
    NgClass,
  ],
})
export class DateInput extends ControlValueAccessorDirective<Date | null> {
  name = input.required<string>();
  label = input<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);
  formFieldClass = input<string>('');

  clearDate(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.control().setValue(null);
  }
}
