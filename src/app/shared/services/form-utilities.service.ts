import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FormUtilitiesService {
  private formSubmitAttempt = new Subject<boolean>();
  private isFormCompleted = new Subject<boolean>();

  getControl(formGroup: FormGroup, fieldName: string): FormControl {
    return formGroup.get(fieldName) as FormControl;
  }

  getFormSubmitAttemptListener(): Observable<boolean> {
    return this.formSubmitAttempt.asObservable();
  }

  setIsFormSubmitAttempt(formSubmitAttempt: boolean): void {
    this.formSubmitAttempt.next(formSubmitAttempt);
  }

  getIsFormCompletedListener(): Observable<boolean> {
    return this.isFormCompleted.asObservable();
  }

  setIsFormCompleted(isFormCompleted: boolean): void {
    this.isFormCompleted.next(isFormCompleted);
  }
}
