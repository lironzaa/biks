import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';

import { ControlValueAccessorDirective } from '../../../directives/input.directive';
import { ErrorInput } from '../error-input/error-input';
import { CustomErrorMessages } from '../../../types/inputs/error-input/custom-error-messages.type';

@Component({
  selector: 'app-checkbox-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInput),
      multi: true,
    },
  ],
  templateUrl: './checkbox-input.html',
  styleUrl: './checkbox-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ErrorInput,
    MatCheckbox,
  ],
})
export class CheckboxInput extends ControlValueAccessorDirective<boolean | null> {
  name = input.required<string>();
  label = input<string>();
  option = input.required<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);
}
