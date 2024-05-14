import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroupDirective, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { takeUntil } from "rxjs";

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
import { selectSelectedTraineesRow } from "../../store/trainees.selectors";
import {
  ConfirmationDialogComponent
} from "../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog.component";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";

@Component({
  selector: "app-trainee-form",
  templateUrl: "./trainee-form.component.html",
  styleUrl: "./trainee-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraineeFormComponent extends Unsubscribe implements OnInit {
  isEditMode = false;
  selectedTraineesRow: TraineeRow | null = null;
  subjectTypeOptions = SubjectTypeOptions;
  isAddGradeForm = false;

  traineeForm = this.fb.group({
    "name": new FormControl<string>("", [ Validators.required ]),
    "grade": new FormControl<number | null>(null, [ Validators.required, Validators.min(0), Validators.max(100) ]),
    "email": new FormControl<string>("", [ Validators.required ]),
    "dateJoined": new FormControl<string>("", [ Validators.required ]),
    "address": new FormControl<string>("", [ Validators.required ]),
    "city": new FormControl<string>("", [ Validators.required ]),
    "country": new FormControl<string>("", [ Validators.required ]),
    "zip": new FormControl<string>("", [ Validators.required, Validators.minLength(4), Validators.maxLength(5) ]),
    "subject": new FormControl<SubjectType | null>(null, [ Validators.required ]),
  });

  gradeForm = this.fb.group({
    "grade": new FormControl<number | null>(null, [ Validators.required, Validators.min(0), Validators.max(100) ]),
    "subject": new FormControl<SubjectType | null>(null, [ Validators.required ]),
    "date": new FormControl<string>("", [ Validators.required ]),
    "traineeId": new FormControl<string>("", [ Validators.required ]),
  });

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  constructor(private fb: FormBuilder, private store: Store<fromApp.AppState>,
              protected formUtilitiesService: FormUtilitiesService, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.initStoreSub();
  }

  initStoreSub(): void {
    this.store.select(selectSelectedTraineesRow).pipe(takeUntil(this.unsubscribe$)).subscribe(selectedTraineesRow => {
      this.selectedTraineesRow = selectedTraineesRow;
      if (this.selectedTraineesRow) {
        this.isEditMode = true;
        this.traineeForm.patchValue(this.selectedTraineesRow);
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
        this.store.dispatch(deleteTrainee({ id: this.selectedTraineesRow!.id }));
        this.store.dispatch(setSelectedTraineeRow({ traineeRow: null }));
      }
    });
  }

  addGrade(): void {
    this.isAddGradeForm = true;
    this.gradeForm.get("traineeId")?.setValue(this.selectedTraineesRow!.id);
  }

  onSubmitTraineeForm(): void {
    console.log(this.traineeForm.value);
    this.isAddGradeForm = false;
    if (this.traineeForm.valid) {
      if (!this.isEditMode) {
        const traineeData: CreateTrainee = this.populateCreateTraineeData();
        console.log(traineeData);
        this.resetTraineeForm();
        this.store.dispatch(createTrainee({ data: traineeData }));
      } else {
        const editTraineeData: EditTrainee = this.populateEditTraineeData();
        const selectedTraineeRow: TraineeRow = this.populateSelectedTraineeRow();
        console.log(editTraineeData);
        console.log(selectedTraineeRow);
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
        id: this.selectedTraineesRow!.id,
        name: this.traineeForm.value.name!,
        email: this.traineeForm.value.email!,
        dateJoined: this.traineeForm.value.dateJoined!,
        address: this.traineeForm.value.address!,
        city: this.traineeForm.value.city!,
        country: this.traineeForm.value.country!,
        zip: this.traineeForm.value.zip!,
      },
      gradeData: {
        id: this.selectedTraineesRow!.gradeId,
        grade: this.traineeForm.value.grade!,
        subject: this.traineeForm.value.subject!,
        date: this.traineeForm.value.dateJoined!,
        traineeId: this.selectedTraineesRow!.id!
      }
    };
  }

  populateSelectedTraineeRow(): TraineeRow {
    return {
      id: this.selectedTraineesRow!.id,
      gradeId: this.selectedTraineesRow!.gradeId,
      name: this.traineeForm.value.name!,
      email: this.traineeForm.value.email!,
      dateJoined: this.traineeForm.value.dateJoined!,
      address: this.traineeForm.value.address!,
      city: this.traineeForm.value.city!,
      country: this.traineeForm.value.country!,
      zip: this.traineeForm.value.zip!,
      grade: this.traineeForm.value.grade!,
      gradeDate: this.selectedTraineesRow!.gradeDate!,
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
    if (this.gradeForm.valid) {
      const gradeData: CreateTraineeGrade = this.populateCreateGradeData();
      this.gradeForm.reset();
      this.isAddGradeForm = false;
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
}
