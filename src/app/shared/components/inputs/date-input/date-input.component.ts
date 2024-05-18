import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { ControlValueAccessorDirective } from "../../../directives/input-directive.directive";

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
export class DateInputComponent<T>
  extends ControlValueAccessorDirective<T>
  implements InputType {
  @Input() placeholder?: string | undefined;
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() name!: string;
  @Input() formName!: string; // required for input with form validation, is used for FormSubmitAttempt

  clearDate(): void {
    this.control?.setValue("");
  }
}
