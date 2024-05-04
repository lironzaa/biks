import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AbstractControl, ControlContainer, FormGroupDirective } from "@angular/forms";

@Component({
  selector: "app-text-input",
  templateUrl: "./text-input.component.html",
  styleUrls: [ "./text-input.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TextInputComponent {
  @Input({ required: true }) formField: AbstractControl | null = null;
  @Input({ required: true }) customFormControlName: string = "";
  @Input({ required: true }) placeholder: string = "";
  @Input() type: "text" | "number" = "text";
}
