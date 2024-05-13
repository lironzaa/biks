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
      ? this.control.setValue(value ? Number(value) : null, { emitModelToViewChange: false })
      : (this.control = new FormControl(value));
  }

  override registerOnChange(fn: (val: number | null) => number): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        map((value: string | null) => this.setNumericValue(value)),
        tap((val) => fn(val))
      )
      .subscribe();
  }

  setNumericValue(num: string | null): number | null {
    const numValue = Number(num);
    return !isNaN(parseFloat(<string>num)) && isFinite(numValue) ? numValue : null;
  }
}
