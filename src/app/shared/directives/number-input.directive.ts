import { Directive } from '@angular/core';
import { distinctUntilChanged, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ControlValueAccessorDirective } from './input.directive';

@Directive({
  selector: '[appNumberControlValueAccessorDirective]',
})
export class NumberInputValueAccessorDirective extends ControlValueAccessorDirective<number | null> {

  override writeValue(value: number | null): void {
    const numericValue = typeof value === 'number' ? value : null;

    if (this.control().value !== numericValue) {
      this.control().setValue(numericValue, { emitEvent: false });
    }
  }

  override registerOnChange(fn: (val: number | null) => void): void {
    this.control().valueChanges
      .pipe(
        startWith(this.control().value),
        distinctUntilChanged(),
        map(value => (typeof value === 'number' ? value : null)),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(value => fn(value));
  }
}
