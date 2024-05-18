import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { ControlValueAccessorDirective } from "../../../directives/input-directive.directive";
import { CheckboxInputOption } from "../../../interfaces/checkbox-input-option";

@Component({
  selector: "app-checkbox-input",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true,
    },
  ],
  templateUrl: "./checkbox-input.component.html",
  styleUrl: "./checkbox-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent<T>
  extends ControlValueAccessorDirective<T>
  implements InputType {
  @Input({ required: true }) option!: CheckboxInputOption;
  @Input() placeholder?: string | undefined;
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() name!: string;
  @Input() formName!: string; // required for input with form validation, is used for FormSubmitAttempt
}
