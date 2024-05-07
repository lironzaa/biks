import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputType } from "../../../types/input-type";
import { ControlValueAccessorDirective } from "../../../directives/input-directive.directive";

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
  @Input({ required: true }) options: string[] = [];
  @Input() placeholder?: string | undefined;
  @Input() value?: string | number | undefined;
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() name!: string;
  @Input() isMultiple = false;

  trackByOptionName(index: number, option: string) {
    return option;
  }
}
