import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { ControlValueAccessorDirective } from "../../../directives/input-directive.directive";
import { CustomErrorMessages } from "../error-input/error-messages";

@Component({
  selector: "app-text-input",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  templateUrl: "./text-input.component.html",
  styleUrls: [ "./text-input.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent<T>
  extends ControlValueAccessorDirective<T>
  implements InputType {
  @Input() override type: "text" | "email" = "text";
  @Input() placeholder?: string | undefined;
  @Input() customErrorMessages: CustomErrorMessages = {};
  @Input() name!: string;
  @Input() formName!: string; // required for input with form validation, is used for FormSubmitAttempt
  @Input() isFullWidth = false;
  value?: string | undefined;
}
