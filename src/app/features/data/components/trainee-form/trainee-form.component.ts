import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroupDirective, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

import * as fromApp from "../../../../core/store/app.reducer";
import {
  createTrainee,
  createTraineeGrade,
  deleteTrainee,
  editTrainee,
  setSelectedTraineeRow
} from "../../store/trainees.actions";
import { CreateTrainee, CreateTraineeGrade, EditTrainee, TraineeRow } from "../../interfaces/trainee-interface";
import { SubjectType } from "../../types/subject-type";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { SubjectTypeOptions } from "../../data/subject-type-options";
import { selectTrainees } from "../../store/trainees.selectors";
import { TraineesState } from "../../store/trainees.reducer";
import {
  ConfirmationDialogComponent
} from "../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-trainee-form",
  templateUrl: "./trainee-form.component.html",
  styleUrl: "./trainee-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraineeFormComponent implements OnInit, OnDestroy {
  isEditMode = false;
  traineesState!: TraineesState;
  subjectTypeOptions = SubjectTypeOptions;
  isAddGradeForm = false;

  traineeForm = this.fb.group({
    "name": new FormControl<string>("", [ Validators.required ]),
    "grade": new FormControl<string>("", [ Validators.required, Validators.min(0), Validators.max(100) ]),
    "email": new FormControl<string>("", [ Validators.required ]),
    "dateJoined": new FormControl<string>("", [ Validators.required ]),
    "address": new FormControl<string>("", [ Validators.required ]),
    "city": new FormControl<string>("", [ Validators.required ]),
    "country": new FormControl<string>("", [ Validators.required ]),
    "zip": new FormControl<string>("", [ Validators.required, Validators.minLength(4), Validators.maxLength(5) ]),
    "subject": new FormControl<SubjectType | null>(null, [ Validators.required ]),
  });

  gradeForm = this.fb.group({
    "grade": new FormControl<string>("", [ Validators.required, Validators.min(0), Validators.max(100) ]),
    "subject": new FormControl<SubjectType | null>(null, [ Validators.required ]),
    "date": new FormControl<string>("", [ Validators.required ]),
    "traineeId": new FormControl<string>("", [ Validators.required ]),
  });

  storeSub!: Subscription;

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  constructor(private fb: FormBuilder, private store: Store<fromApp.AppState>,
              protected formUtilitiesService: FormUtilitiesService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectTrainees).subscribe((traineesState: TraineesState) => {
      this.traineesState = traineesState;
      // console.log(this.traineesState);
      if (this.traineesState.selectedTraineesRow) {
        this.isEditMode = true;
        console.log(this.traineesState.selectedTraineesRow);
        this.traineeForm.patchValue(this.traineesState.selectedTraineesRow);
      } else {
        this.isEditMode = false;
        this.traineeForm.reset();
      }
    });
  }

  addTrainee(): void {
    this.store.dispatch(setSelectedTraineeRow({ traineeRow: null }));
  }

  onDeleteTrainee(): void {
    this.openConfirmationDialog();

  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: "Are you sure want to delete?",
        buttonText: {
          ok: "Yes",
          cancel: "No"
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteTrainee({ id: this.traineesState.selectedTraineesRow!.id }));
        this.store.dispatch(setSelectedTraineeRow({ traineeRow: null }));
      }
    });
  }

  addGrade(): void {
    this.isAddGradeForm = true;
    this.gradeForm.get("traineeId")?.setValue(this.traineesState.selectedTraineesRow!.id);
    console.log(this.gradeForm.value);
  }

  onSubmitTraineeForm(): void {
    this.isAddGradeForm = false;
    if (this.traineeForm.valid) {
      if (!this.isEditMode) {
        const traineeData: CreateTrainee = this.populateCreateTraineeData();
        this.resetTraineeForm();
        console.log(traineeData);
        this.store.dispatch(createTrainee({ data: traineeData }));
      } else {
        const editTraineeData: EditTrainee = this.populateEditTraineeData();
        const selectedTraineeRow: TraineeRow = this.populateSelectedTraineeRow();
        this.resetTraineeForm();
        this.store.dispatch(editTrainee({ data: editTraineeData, selectedTraineeRow }));
      }
    } else {
      this.formUtilitiesService.setIsFormSubmitAttempt(true);
    }
  }

  populateCreateTraineeData(): CreateTrainee {
    return {
      traineeData: {
        name: this.traineeForm.value.name!,
        email: this.traineeForm.value.email!,
        dateJoined: this.traineeForm.value.dateJoined!,
        address: this.traineeForm.value.address!,
        city: this.traineeForm.value.city!,
        country: this.traineeForm.value.country!,
        zip: this.traineeForm.value.zip!,
      },
      gradeData: {
        grade: this.traineeForm.value.grade!,
        subject: this.traineeForm.value.subject!,
        date: this.traineeForm.value.dateJoined!,
        traineeId: ""
      }
    };
  }

  populateEditTraineeData(): EditTrainee {
    return {
      traineeData: {
        id: this.traineesState.selectedTraineesRow!.id,
        name: this.traineeForm.value.name!,
        email: this.traineeForm.value.email!,
        dateJoined: this.traineeForm.value.dateJoined!,
        address: this.traineeForm.value.address!,
        city: this.traineeForm.value.city!,
        country: this.traineeForm.value.country!,
        zip: this.traineeForm.value.zip!,
      },
      gradeData: {
        id: this.traineesState.selectedTraineesRow!.gradeId,
        grade: this.traineeForm.value.grade!,
        subject: this.traineeForm.value.subject!,
        traineeId: this.traineesState.selectedTraineesRow!.id!
      }
    };
  }

  populateSelectedTraineeRow(): TraineeRow {
    return {
      id: this.traineesState.selectedTraineesRow!.id,
      gradeId: this.traineesState.selectedTraineesRow!.gradeId,
      name: this.traineeForm.value.name!,
      email: this.traineeForm.value.email!,
      dateJoined: this.traineeForm.value.dateJoined!,
      address: this.traineeForm.value.address!,
      city: this.traineeForm.value.city!,
      country: this.traineeForm.value.country!,
      zip: this.traineeForm.value.zip!,
      grade: this.traineeForm.value.grade!,
      gradeDate: this.traineesState.selectedTraineesRow!.gradeDate!,
      subject: this.traineeForm.value.subject!,
    }
  }

  resetTraineeForm(): void {
    this.formUtilitiesService.setIsFormSubmitAttempt(false);
    this.formUtilitiesService.setIsFormCompleted(true);
    this.traineeForm.reset();
    this.formDirective.resetForm();
  }

  onSubmitGradeForm(): void {
    console.log(this.gradeForm);
    if (this.gradeForm.valid) {
      const gradeData: CreateTraineeGrade = this.populateCreateGradeData();
      this.gradeForm.reset();
      this.isAddGradeForm = false;
      console.log(gradeData);
      this.store.dispatch(createTraineeGrade({ data: gradeData }));
    } else {
      this.formUtilitiesService.setIsFormSubmitAttempt(true);
    }
  }

  populateCreateGradeData(): CreateTraineeGrade {
    return {
      grade: this.gradeForm.value.grade!,
      subject: this.gradeForm.value.subject!,
      date: this.gradeForm.value.date!,
      traineeId: this.gradeForm.value.traineeId!
    };
  }

  ngOnDestroy(): void {
    if (!this.storeSub.closed) this.storeSub.unsubscribe();
  }
}
