import { Directive } from "@angular/core";
import { distinctUntilChanged, startWith, takeUntil, tap } from "rxjs";
import { map } from "rxjs/operators";
import { FormControl } from "@angular/forms";

import { ControlValueAccessorDirective } from "./input-directive.directive";

@Directive({
  selector: "[appNumberControlValueAccessorDirective]",
  standalone: true
})
export class NumberControlValueAccessorDirective extends ControlValueAccessorDirective<number> {

  override writeValue(value: number | null): void {
    this.control
      ? this.control.setValue(typeof value === "number" ? value : null, { emitModelToViewChange: false })
      : (this.control = new FormControl(value));
  }

  override registerOnChange(fn: (val: number | null) => number): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        map((value: number | string | null) => {
          console.log("value is :");
          console.log(value);
          console.log("typeof value is :");
          console.log(typeof value);
          return typeof value === "number" ? value : null;
        }),
        tap((val: number | null) => {
          console.log("Transformed value:", val);
          console.log("fn(val) is ");
          console.log(fn);
          console.log(fn(val));
          return fn(val);
        })
      ).subscribe();
  }
}
