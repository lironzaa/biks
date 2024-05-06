import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { combineLatest, Observable, of, startWith } from "rxjs";
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
  @Input() public controlName?: string;
  @Input() public formContained!: AbstractControl;

  error$!: Observable<string>;
  isFormSubmitted$: Observable<boolean>;
  isFormCompleted$: Observable<boolean>;
  initialState = true;

  constructor(private formUtilitiesService: FormUtilitiesService) {
    this.isFormSubmitted$ = this.formUtilitiesService.getFormSubmitAttemptListener();
    this.isFormCompleted$ = this.formUtilitiesService.getIsFormCompletedListener();
  }

  ngOnInit(): void {
    this.initError$();
  }

  initError$(): void {
    const valueChange$: Observable<string> = this.control?.valueChanges.pipe(
      map((value) => value)
    ) || of("");

    this.isFormCompleted$.subscribe(() => {
      this.initialState = true;
    })

    this.error$ = combineLatest([
      valueChange$.pipe(startWith("")),
      this.isFormSubmitted$.pipe(startWith(false)),
    ]).pipe(
      map(() => {
        if (this.initialState) {
          this.initialState = false;
          return "";
        }
        return this.control?.errors ? this.getErrorMessage(this.control?.errors as ValidationErrors) : "";
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
    if (errorFunction) {
      return errorFunction(error[errorName]);
    } else {
      return "An error occurred";
    }
  }
}
