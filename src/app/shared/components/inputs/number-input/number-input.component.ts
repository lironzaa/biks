import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { NumberControlValueAccessorDirective } from "../../../directives/number-input.directive";
import { CustomErrorMessages } from "../error-input/error-messages";

@Component({
  selector: "app-number-input",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
  templateUrl: "./number-input.component.html",
  styleUrl: "./number-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberInputComponent
  extends NumberControlValueAccessorDirective
  implements InputType {
  @Input() placeholder?: string | undefined;
  @Input() customErrorMessages: CustomErrorMessages = {};
  @Input() name!: string;
  @Input() formName!: string; // required for input with form validation, is used for FormSubmitAttempt
  @Input() isFullWidth = false;
  @Input() digitsAfterDecimal = 2;
  @Input() maxNumberLength = 1000000;
  value?: number | undefined;
}
