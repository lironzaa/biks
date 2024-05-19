import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
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
import {
  CreateTrainee,
  EditTrainee,
  TraineeGrade,
  TraineeRow
} from "../../interfaces/trainee-interface";
import { SubjectType } from "../../types/subject-type";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { SubjectTypeOptions } from "../../data/subject-type-options";
import { selectSelectedTraineesRow } from "../../store/trainees.selectors";
import {
  ConfirmationDialogComponent
} from "../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog.component";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";
import { GradeCreateData, TraineeCreateData } from "../../types/trainee-type";

@Component({
  selector: "app-trainee-form",
  templateUrl: "./trainee-form.component.html",
  styleUrl: "./trainee-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraineeFormComponent extends Unsubscribe implements OnInit, OnDestroy {
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

  gradeFormKey = "gradeForm";
  traineeFormKey = "traineeForm";
  formsKeys = [ this.traineeFormKey, this.gradeFormKey ];

  @ViewChild("traineeFormDirective") traineeFormDirective!: FormGroupDirective;
  @ViewChild("gradeFormDirective") gradeFormDirective!: FormGroupDirective;

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
    this.resetForm(this.traineeFormKey, this.traineeForm, this.traineeFormDirective);
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
    if (this.traineeForm.valid) {
      if (!this.isEditMode) {
        const traineeData: CreateTrainee = this.populateCreateTraineeData();
        this.resetForm(this.traineeFormKey, this.traineeForm, this.traineeFormDirective);
        this.store.dispatch(createTrainee({ data: traineeData }));
      } else {
        const editTraineeData: EditTrainee = this.populateEditTraineeData();
        const selectedTraineeRow: TraineeRow = this.populateSelectedTraineeRow();
        this.resetForm(this.traineeFormKey, this.traineeForm, this.traineeFormDirective);
        this.store.dispatch(editTrainee({ data: editTraineeData, selectedTraineeRow }));
      }
    } else {
      this.formUtilitiesService.setIsFormSubmitAttempt(this.traineeFormKey, true);
    }
  }

  populateCreateTraineeData(): CreateTrainee {
    return {
      traineeData: {
        ...this.getCommonTraineeData()
      },
      gradeData: {
        ...this.getCommonGradeData(),
        traineeId: ""
      }
    };
  }

  populateEditTraineeData(): EditTrainee {
    return {
      traineeData: {
        id: this.selectedTraineesRow!.id,
        ...this.getCommonTraineeData()
      },
      gradeData: {
        id: this.selectedTraineesRow!.gradeId,
        ...this.getCommonGradeData(),
        traineeId: this.selectedTraineesRow!.id!
      }
    };
  }

  getCommonTraineeData(): TraineeCreateData {
    return {
      name: this.traineeForm.value.name!,
      email: this.traineeForm.value.email!,
      dateJoined: this.traineeForm.value.dateJoined!,
      address: this.traineeForm.value.address!,
      city: this.traineeForm.value.city!,
      country: this.traineeForm.value.country!,
      zip: this.traineeForm.value.zip!,
    }
  }

  getCommonGradeData(): Omit<TraineeGrade, "id" | "traineeId"> {
    return {
      grade: this.traineeForm.value.grade!,
      subject: this.traineeForm.value.subject!,
      date: this.traineeForm.value.dateJoined!,
    }
  }

  populateSelectedTraineeRow(): TraineeRow {
    return {
      id: this.selectedTraineesRow!.id,
      gradeId: this.selectedTraineesRow!.gradeId,
      ...this.getCommonTraineeData(),
      grade: this.traineeForm.value.grade!,
      gradeDate: this.selectedTraineesRow!.gradeDate!,
      subject: this.traineeForm.value.subject!,
    }
  }

  resetForm(formKey: string, form: FormGroup, formDirective: FormGroupDirective): void {
    this.formUtilitiesService.setIsFormSubmitAttempt(formKey, false);
    form.reset();
    formDirective.resetForm();
  }

  onSubmitGradeForm(): void {
    if (this.gradeForm.valid) {
      const gradeData: GradeCreateData = this.populateCreateGradeData();
      this.resetForm(this.gradeFormKey, this.gradeForm, this.gradeFormDirective);
      this.gradeForm.get("traineeId")?.setValue(this.selectedTraineesRow!.id);
      this.store.dispatch(createTraineeGrade({ data: gradeData }));
    } else {
      this.formUtilitiesService.setIsFormSubmitAttempt(this.gradeFormKey, true);
    }
  }

  populateCreateGradeData(): GradeCreateData {
    return {
      grade: this.gradeForm.value.grade!,
      subject: this.gradeForm.value.subject!,
      date: this.gradeForm.value.date!,
      traineeId: this.gradeForm.value.traineeId!
    };
  }

  override ngOnDestroy(): void {
    this.store.dispatch(setSelectedTraineeRow({ traineeRow: null }));
    this.formUtilitiesService.removeFormSubmitAttempt(this.formsKeys);
  }
}
