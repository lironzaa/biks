import { Directive } from "@angular/core";
import { distinctUntilChanged, startWith, takeUntil, tap } from "rxjs";
import { map } from "rxjs/operators";
import { FormControl } from "@angular/forms";

import { ControlValueAccessorDirective } from "./input-directive.directive";

@Directive({
  selector: "[appDateControlValueAccessorDirective]",
  standalone: true
})
export class DateControlValueAccessorDirective extends ControlValueAccessorDirective<Date | string | null> {
  override writeValue(value: string | null): void {
    this.control
      ? this.control.setValue(typeof value === "string" ? new Date(value) : null, { emitModelToViewChange: false })
      : (this.control = new FormControl(value));
  }

  override registerOnChange(fn: (val: Date | null) => Date | null): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        map((value: Date | null) => value),
        tap((val: Date | null) => fn(val))
      ).subscribe();
  }
}
