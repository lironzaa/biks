import { Injectable } from "@angular/core";
import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FormUtilitiesService {
  private isFormSubmitted = new Subject<boolean>();

  getValidators(formGroup: FormGroup, fieldName: string): ValidatorFn[] {
    const fieldControl = formGroup.get(fieldName);
    if (fieldControl && fieldControl.validator) {
      return [ fieldControl.validator ];
    }
    return [];
  }

  getControl(formGroup: FormGroup, fieldName: string): FormControl {
    return formGroup.get(fieldName) as FormControl;
  }

  getIsFormSubmittedListener(): Observable<boolean> {
    return this.isFormSubmitted.asObservable();
  }

  setIsFormSubmitted(isFormSubmitted: boolean): void {
    this.isFormSubmitted.next(isFormSubmitted);
  }
}
