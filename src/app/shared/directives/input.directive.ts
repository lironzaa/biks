import {
  Directive,
  inject,
  Injector,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NgControl,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessorDirective]',
})
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit {
  injector = inject(Injector);
  protected destroyRef = inject(DestroyRef);

  protected control = signal<FormControl>(new FormControl());
  public onTouched: () => void = () => {
  };
  protected isRequired = signal(false);
  private disabledState = new BehaviorSubject<boolean>(false);
  private initialBlurEvent = signal(true);

  ngOnInit(): void {
    this.setFormControl();
    this.setIsRequired();
    this.setInitialIsDisabled();
  }

  onBlur(): void {
    if (!this.control().touched) this.control().markAsTouched();

    if (this.initialBlurEvent()) {
      this.control().updateValueAndValidity({ emitEvent: true });
      this.initialBlurEvent.set(false);
    }
    this.onTouched();
  }

  setFormControl(): void {
    try {
      const ngControl = this.injector.get(NgControl);
      const formControl = (ngControl as FormControlDirective).form as FormControl;
      this.control.set(formControl);
    } catch (err) {
      console.warn('NgControl not found, using default FormControl', err);
    }
  }

  setInitialIsDisabled(): void {
    if (this.control().disabled) this.disabledState.next(true);

    this.disabledState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isDisabled => {
        const control = this.control();
        if (control.disabled !== isDisabled) {
          isDisabled ? control.disable({ emitEvent: false }) : control.enable({ emitEvent: false });
        }
      });
  }

  setIsRequired(): void {
    this.isRequired.set(this.control().hasValidator(Validators.required));  // No more null check!
  }

  writeValue(value: T): void {
    if (this.control().value !== value) {  // No more null check!
      this.control().setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (val: T | null) => void): void {
    this.control().valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(value => fn(value as T | null));
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabledState.next(isDisabled);
  }
}
