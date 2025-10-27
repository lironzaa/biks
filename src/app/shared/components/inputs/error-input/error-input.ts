import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal
} from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CustomErrorMessages } from '../../../types/inputs/error-input/custom-error-messages.type';
import {
  MaxLengthError,
  MinLengthError,
  MinMaxError
} from '../../../interfaces/inputs/error-input/error-type.interface';

@Component({
  selector: 'app-error-input',
  templateUrl: './error-input.html',
  styleUrl: './error-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorInput implements OnInit {
  private destroyRef = inject(DestroyRef);

  control = input.required<FormControl>();
  controlName = input.required<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);

  private controlNameUppercase = computed(() => {
    const name = this.controlName();
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  });
  private controlTouchedSignal = signal(false);
  private controlErrorsSignal = signal<ValidationErrors | null>(null);

  // Reset touched signal when isFormSubmitted changes to false
  private resetTouchedEffect = effect(() => {
    // console.log('effect resetTouchedEffect', 'component:', this.controlName())
    if (!this.isFormSubmitted()) {
      this.controlTouchedSignal.set(false);
      // console.log('effect change');
    }
  });

  ngOnInit(): void {
    this.initControlErrorStateTracking();
  }

  private initControlErrorStateTracking(): void {
    // Track value changes
    this.control().valueChanges.pipe(
      startWith(null),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.updateStateSignals());

    // Track status changes for async validators
    this.control().statusChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.updateStateSignals());
  }

  private updateStateSignals(): void {
    this.controlTouchedSignal.set(this.control().touched);
    this.controlErrorsSignal.set(this.control().errors);
  }

  shouldShowErrors = computed(() => {
    const hasErrors = this.controlErrorsSignal() !== null;
    const isTouched = this.controlTouchedSignal();
    const wasSubmitted = this.isFormSubmitted();

    return hasErrors && (isTouched || wasSubmitted);
  });

  errorMessage = computed(() => {
    const errors = this.controlErrorsSignal();
    if (!errors) return '';

    const errorPriority = [ 'required', 'email', 'minlength', 'maxlength', 'pattern', 'min', 'max', 'templateNameExists' ];
    const errorKey = errorPriority.find(key => errors[key]) || Object.keys(errors)[0];

    const customMessage = this.customErrorMessages()[errorKey];
    if (customMessage) return customMessage;

    return this.getDefaultErrorMessage(errorKey, errors[errorKey]);
  });

  private getDefaultErrorMessage(errorKey: string, errorValue: unknown): string {
    const messages: Record<string, (value: unknown) => string> = {
      required: () => `${ this.controlNameUppercase() } is required`,

      minlength: (err: unknown) => {
        const error = err as MinLengthError;
        return `${ this.controlNameUppercase() } must be at least ${ error.requiredLength } characters`;
      },

      maxlength: (err: unknown) => {
        const error = err as MaxLengthError;
        return `${ this.controlNameUppercase() } cannot exceed ${ error.requiredLength } characters`;
      },

      email: () => `Please enter a valid email address`,

      min: (err: unknown) => {
        const error = err as MinMaxError;
        return `${ this.controlNameUppercase() } must be at least ${ error.min }`;
      },

      max: (err: unknown) => {
        const error = err as MinMaxError;
        return `${ this.controlNameUppercase() } cannot exceed ${ error.max }`;
      },

      pattern: () => `${ this.controlNameUppercase() } format is invalid`
    };

    const messageFunc = messages[errorKey];
    return messageFunc ? messageFunc(errorValue) : `${ this.controlName() } is invalid`;
  }
}
