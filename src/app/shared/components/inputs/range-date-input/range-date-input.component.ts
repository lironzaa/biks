import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { CustomErrorMessages } from "../error-input/error-messages";
import { GroupControlValueAccessorDirective } from "../../../directives/group-input.directive";

@Component({
  selector: "app-range-date-input",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeDateInputComponent),
      multi: true,
    },
  ],
  templateUrl: "./range-date-input.component.html",
  styleUrl: "./range-date-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeDateInputComponent<T>
  extends GroupControlValueAccessorDirective<T>
  implements InputType {
  @Input() placeholder?: string | undefined;
  @Input() customErrorMessages: CustomErrorMessages = {};
  @Input() name!: string;
  @Input() formName!: string; // required for input with form validation, is used for FormSubmitAttempt
  @Input() startDateControl!: FormControl;
  @Input() endDateControl!: FormControl;

  clearDate(): void {
    this.startDateControl.reset();
    this.endDateControl.reset();
  }
}
