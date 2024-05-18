import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { combineLatest, distinctUntilChanged, Observable, of, shareReplay, startWith } from "rxjs";
import { map } from "rxjs/operators";

import { DefaultErrorMessages } from "../../../interfaces/error-input.interface";
import { FormUtilitiesService } from "../../../services/form-utilities.service";

@Component({
  selector: "app-error-input",
  templateUrl: "./error-input.component.html",
  styleUrl: "./error-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorInputComponent implements OnInit {
  @Input({ required: true }) public controlName?: string;
  @Input({ required: true }) public formContained!: AbstractControl;
  @Input({ required: true }) public formName!: string;

  error$!: Observable<string>;
  isFormSubmitted$!: Observable<boolean>;

  constructor(private formUtilitiesService: FormUtilitiesService) {
  }

  ngOnInit(): void {
    this.isFormSubmitted$ = this.formUtilitiesService.getFormSubmitAttemptListener(this.formName);
    this.initError$();
  }

  initError$(): void {
    const valueChange$: Observable<string> = this.control?.valueChanges.pipe(
      startWith(this.control?.value),
      map((value) => value),
      distinctUntilChanged(),
      shareReplay(1)
    ) || of("");

    this.error$ = combineLatest([
      valueChange$.pipe(startWith("")),
      this.isFormSubmitted$.pipe(startWith(false),),
    ]).pipe(
      map(([ valueChange, isFormSubmitted ]) => {
        if (valueChange) this.control?.markAsTouched();
        return (!this.control?.untouched || isFormSubmitted) && this.control?.errors ? this.getErrorMessage(this.control?.errors as ValidationErrors) : "";
      })
    );
  }

  private get control(): AbstractControl | null {
    if (this.formContained && this.controlName) {
      return this.formContained instanceof FormGroup
        ? this.formContained.get(this.controlName)
        : this.formContained;
    }
    return null;
  }

  private getErrorMessage(error: ValidationErrors): string {
    const [ errorName ] = Object.keys(error);
    const errorFunction = DefaultErrorMessages[errorName];
    if (errorFunction) return errorFunction(error[errorName]);
    else return "An error occurred";
  }
}
