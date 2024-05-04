import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./app-button.component.html",
  styleUrl: "./app-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppButtonComponent {
  @Input({ required: true }) color!: "warn" | "primary" | "accent";
  @Input({ required: true }) text = "";
  @Input() isDisabled = false;
  @Output() buttonClicked = new EventEmitter();

  onButtonClick(): void {
    this.buttonClicked.emit();
  }
}
