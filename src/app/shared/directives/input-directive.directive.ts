import {
  Directive,
  Inject,
  Injector,
  Input,
  OnInit,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
} from "@angular/forms";
import { Subject, distinctUntilChanged, startWith, takeUntil, tap } from "rxjs";

@Directive({
  standalone: true,
  selector: "[appControlValueAccessorDirective]",
})
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit {
  constructor(@Inject(Injector) private injector: Injector) {
  }

  @Input() type = "text";
  control: FormControl | undefined;
  private _isDisabled = false;
  protected _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  ngOnInit(): void {
    this.setFormControl();
  }

  setFormControl() {
    try {
      const formControl = this.injector.get(NgControl);
      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective)
            .form as FormControl;
          break;
      }
    } catch (err) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    this.control
      ? this.control.setValue(value, { emitModelToViewChange: false })
      : (this.control = new FormControl(value));
  }

  registerOnChange(fn: (val: T | null) => T): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        tap((val) => fn(val))
      ).subscribe();
  }

  registerOnTouched(fn: () => T): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
    if (this.control && this.control.disabled !== this._isDisabled) {
      isDisabled ? this.control.disable() : this.control.enable();
    }
  }
}
