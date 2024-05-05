import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";

import * as fromApp from "../../../../core/store/app.reducer";
import { createTrainee } from "../../store/trainees.actions";
import { CreateTrainee } from "../../interfaces/trainee-interface";
import { SubjectType } from "../../types/subject-type";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { SubjectTypeOptions } from "../../data/subject-type-options";

@Component({
  selector: "app-trainee-form",
  templateUrl: "./trainee-form.component.html",
  styleUrl: "./trainee-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraineeFormComponent {
  isEditMode = false;

  traineeForm = this.fb.group({
    "id": new FormControl<number | null>({ value: null, disabled: true }),
    "name": new FormControl<string>(""),
    "grade": new FormControl<number | null>(null),
    "email": new FormControl<string>(""),
    "dateJoined": new FormControl<string>(""),
    "address": new FormControl<string>(""),
    "city": new FormControl<string>(""),
    "country": new FormControl<string>(""),
    "zip": new FormControl<number | null>(null),
    "subject": new FormControl<SubjectType | null>(null),
  });

  subjectTypeOptions = SubjectTypeOptions;

  constructor(private fb: FormBuilder, private store: Store<fromApp.AppState>,
              protected formUtilitiesService: FormUtilitiesService) {
  }

  onSubmitForm(): void {
    console.log(this.traineeForm.value);
    this.formUtilitiesService.setIsFormSubmitted(true);
    if (this.traineeForm.valid) {
      const formValue = this.traineeForm.value;
      // const clientDate = new Date((formValue.eventDate) as string).toLocaleString([ "sv-SE" ]);

      if (!this.isEditMode) {
        const trainee: CreateTrainee = {
          name: formValue.name!,
          grade: formValue.grade!,
          email: formValue.email!,
          dateJoined: formValue.dateJoined!,
          address: formValue.address!,
          city: formValue.city!,
          country: formValue.country!,
          zip: formValue.zip!,
          subject: formValue.subject!
        };
        this.store.dispatch(createTrainee({ traineeData: trainee }));
      } else {
        // this.store.dispatch(new ClientsActions.UpdateClient({
        //   clientId: this.clientId, client
        // }));
      }
    }
  }
}
