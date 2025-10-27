import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { ControlValueAccessorDirective } from '../../../directives/input.directive';
import { ErrorInput } from '../error-input/error-input';
import { CustomErrorMessages } from '../../../types/inputs/error-input/custom-error-messages.type';

@Component({
  selector: 'app-text-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInput),
      multi: true,
    },
  ],
  templateUrl: './text-input.html',
  styleUrls: [ './text-input.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ErrorInput,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
  ],
})
export class TextInput extends ControlValueAccessorDirective<string | null> {
  name = input.required<string>();
  label = input<string>();
  type = input<'text' | 'email'>('text');
  mask = input<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);
}
