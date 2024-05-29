import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { ControlValueAccessorDirective } from "../../../directives/input-directive.directive";
import { CustomErrorMessages } from "../error-input/error-messages";

@Component({
  selector: "app-select-input",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true,
    },
  ],
  templateUrl: "./select-input.component.html",
  styleUrl: "./select-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputComponent<T>
  extends ControlValueAccessorDirective<T>
  implements InputType {
  @Input({ required: true }) options: (string | number)[] = [];
  @Input() placeholder?: string | undefined;
  @Input() customErrorMessages: CustomErrorMessages = {};
  @Input() name!: string;
  @Input() formName!: string; // required for input with form validation, is used for FormSubmitAttempt
  @Input() isMultiple = false;
  @Input() isEmptyOption = false;
  @Input() isFullWidth = false;

  trackByOptionName(index: number, option: string | number): string | number {
    return option;
  }
}
