import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FormUtilitiesService {
  private formSubmitAttempts: { [key: string]: Subject<boolean> } = {};

  getControl(formGroup: FormGroup, fieldName: string): FormControl {
    return formGroup.get(fieldName) as FormControl;
  }

  getFormSubmitAttemptListener(formKey: string): Observable<boolean> {
    if (!this.formSubmitAttempts[formKey]) this.formSubmitAttempts[formKey] = new Subject<boolean>();
    return this.formSubmitAttempts[formKey].asObservable();
  }

  setIsFormSubmitAttempt(formKey: string, formSubmitAttempt: boolean): void {
    this.formSubmitAttempts[formKey].next(formSubmitAttempt);
  }

  removeFormSubmitAttempt(formKeys: string[]): void {
    formKeys.forEach(formKey => delete this.formSubmitAttempts[formKey])
  }
}
