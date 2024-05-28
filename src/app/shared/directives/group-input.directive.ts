import { Directive, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ControlValueAccessorDirective } from "./input-directive.directive";

@Directive({
  selector: "[appGroupControlValueAccessorDirective]",
  standalone: true
})
export class GroupControlValueAccessorDirective<T> extends ControlValueAccessorDirective<T> implements OnInit {
  formGroup!: FormGroup;

  override ngOnInit(): void {
    this.setFormGroup();
    super.ngOnInit();
  }

  setFormGroup() {
    this.formGroup = new FormGroup({});
  }
}
