import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  input,
  OnInit,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

import { ControlValueAccessorDirective } from '../../../directives/input.directive';
import { ErrorInput } from '../error-input/error-input';
import { CustomErrorMessages } from '../../../types/inputs/error-input/custom-error-messages.type';
import { AppSelectItem } from '../../../interfaces/general/app-select-item.interface';

@Component({
  selector: 'app-select-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInput),
      multi: true,
    },
  ],
  templateUrl: './select-input.html',
  styleUrl: './select-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ErrorInput,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    NgClass,
  ],
})
export class SelectInput<T extends AppSelectItem> extends ControlValueAccessorDirective<T['id']> implements OnInit {
  options = input.required<T[]>();
  name = input.required<string>();
  label = input<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isMultiple = input<boolean>(false);
  isHorizontal = input<boolean>(false);
  isEmptyOption = input<boolean>(false);
  isFormSubmitted = input(false);
  formFieldClass = input<string>('');
  @HostBinding('class.is-horizontal') isHorizontalClass = false;
  valueSelected = output<T>();

  override ngOnInit(): void {
    super.ngOnInit();
    this.isHorizontalClass = this.isHorizontal();
  }
}
