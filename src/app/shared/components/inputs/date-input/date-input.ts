import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
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
    MatDatepickerToggle,
    MatIcon,
    MatDatepicker,
    MatDatepickerToggleIcon,
    MatInput,
    MatDatepickerInput,
    MatError,
    MatIconButton
  ],
})
export class DateInput extends ControlValueAccessorDirective<Date | null> {
  name = input.required<string>();
  label = input<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);

  clearDate(): void {
    this.control()?.setValue(null);
  }
}
