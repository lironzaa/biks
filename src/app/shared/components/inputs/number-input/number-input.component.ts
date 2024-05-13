import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { NumberControlValueAccessorDirective } from "../../../directives/number-input.directive";

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
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() name!: string;
  @Input() isFullWidth = false;
  @Input() digitsAfterDecimal = 2;
  @Input() maxNumber = 1000000;
  value?: number | undefined;
}
