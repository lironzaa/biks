import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { CustomErrorMessages } from "../error-input/error-messages";
import { DateControlValueAccessorDirective } from "../../../directives/date-input.directive";

@Component({
  selector: "app-date-input",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
  templateUrl: "./date-input.component.html",
  styleUrl: "./date-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent
  extends DateControlValueAccessorDirective
  implements InputType {
  @Input() placeholder?: string | undefined;
  @Input() customErrorMessages: CustomErrorMessages = {};
  @Input() name!: string;
  @Input() formName!: string; // required for input with form validation, is used for FormSubmitAttempt

  clearDate(): void {
    this.control?.setValue(null);
  }
}
