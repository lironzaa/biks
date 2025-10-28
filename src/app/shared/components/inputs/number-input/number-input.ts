import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { NumberInputValueAccessorDirective } from '../../../directives/number-input.directive';
import { CustomErrorMessages } from '../../../types/inputs/error-input/custom-error-messages.type';
import { ErrorInput } from '../error-input/error-input';

@Component({
  selector: 'app-number-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInput),
      multi: true,
    },
  ],
  templateUrl: './number-input.html',
  styleUrl: './number-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ErrorInput,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgClass,
  ],
})
export class NumberInput extends NumberInputValueAccessorDirective {
  name = input.required<string>();
  label = input<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);
  formFieldClass = input<string>('');
}
