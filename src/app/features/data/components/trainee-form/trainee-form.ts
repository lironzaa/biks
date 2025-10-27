import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ErrorService } from '../../../../shared/services/error/error.service';
import { CreateTrainee, EditTrainee, TraineeGrade, TraineeRow } from '../../interfaces/trainee-interface';
import { SubjectTypeOptions } from '../../data/subject-type-options';
import { EMAIL_REGEX } from '../../../../shared/regex/regex';
import { SubjectType } from '../../types/subject-type';
import { TraineeFormCustomErrorsData } from '../../data/trainee-form-custom-errors';
import { traineesFeature } from '../../store/trainees.reducer';
import {
  createTrainee,
  deleteTrainee,
  editTrainee,
  setSelectedTraineeRow
} from '../../store/trainees.actions';
import { TraineeCreateData } from '../../types/trainee-type';
import {
  ConfirmationDialogComponent
} from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Button } from '../../../../shared/components/buttons/button/button';
import { TextInput } from '../../../../shared/components/inputs/text-input/text-input';
import { SelectInput } from '../../../../shared/components/inputs/select-input/select-input';
import { NumberInput } from '../../../../shared/components/inputs/number-input/number-input';
import { DateInput } from '../../../../shared/components/inputs/date-input/date-input';
import { GradeForm } from '../grade-form/grade-form';

@Component({
  selector: 'app-trainee-form',
  imports: [
    Button,
    ReactiveFormsModule,
    TextInput,
    SelectInput,
    NumberInput,
    DateInput,
    GradeForm
  ],
  templateUrl: './trainee-form.html',
  styleUrl: './trainee-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraineeForm {
  fb = inject(FormBuilder);
  store = inject(Store);
  dialog = inject(MatDialog);
  errorService = inject(ErrorService);
  destroyRef = inject(DestroyRef);

  isEditMode = signal(false);
  selectedTraineesRow = signal<TraineeRow | null>(null);
  subjectTypeOptions = signal(SubjectTypeOptions);
  isAddGradeForm = signal(false);
  isFormSubmitted = signal(false);

  traineeForm = this.fb.group({
    "name": new FormControl<string | null>(null, [ Validators.required ]),
    "grade": new FormControl<number | null>(null, [ Validators.required, Validators.min(0), Validators.max(100) ]),
    "email": new FormControl<string | null>(null, [ Validators.required, Validators.pattern(EMAIL_REGEX) ]),
    "dateJoined": new FormControl<string | Date | null>(null, [ Validators.required ]),
    "address": new FormControl<string | null>(null, [ Validators.required ]),
    "city": new FormControl<string | null>(null, [ Validators.required ]),
    "country": new FormControl<string | null>(null, [ Validators.required ]),
    "zip": new FormControl<string | null>(null, [ Validators.required, Validators.minLength(5), Validators.maxLength(7) ]),
    "subject": new FormControl<SubjectType | null>(null, [ Validators.required ]),
  });


  traineeFormCustomErrors = TraineeFormCustomErrorsData;

  traineeFormDirective = viewChild.required<FormGroupDirective>("traineeFormDirective");

  ngOnInit(): void {
    this.initStoreSub();
  }

  initStoreSub(): void {
    this.store.select(traineesFeature.selectSelectedTraineesRow).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(selectedTraineesRow => {
      this.selectedTraineesRow.set(selectedTraineesRow);
      const selectedTraineesRowData = this.selectedTraineesRow();
      if (selectedTraineesRowData) {
        this.isEditMode.set(true);
        this.traineeForm.patchValue(selectedTraineesRowData);
      } else {
        this.isEditMode.set(false);
        this.traineeForm.reset();
      }
    });
  }

  addTrainee(): void {
    this.resetForm();
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
      const selectedTraineesRowData = this.selectedTraineesRow();
      if (confirmed && selectedTraineesRowData) this.store.dispatch(deleteTrainee({ id: selectedTraineesRowData.id }));
    });
  }

  addGrade(): void {
    this.isAddGradeForm.set(true);
  }

  onSubmitTraineeForm(): void {
    this.isFormSubmitted.set(true);
    if (this.traineeForm.valid) {
      if (!this.isEditMode()) {
        const traineeData: CreateTrainee = this.populateCreateTraineeData();
        console.log(traineeData);
        this.resetForm();
        this.store.dispatch(createTrainee({ data: traineeData }));
      } else {
        const editTraineeData: EditTrainee = this.populateEditTraineeData();
        console.log(editTraineeData);
        const selectedTraineeRow: TraineeRow = this.populateSelectedTraineeRow();
        this.resetForm();
        this.store.dispatch(editTrainee({ data: editTraineeData, selectedTraineeRow }));
      }
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
    const selectedTraineesRowData = this.selectedTraineesRow();
    console.log(selectedTraineesRowData);
    if (!selectedTraineesRowData) throw this.errorService.throwError("Selected Trainees Row is not defined");
    return {
      traineeData: {
        id: selectedTraineesRowData.id,
        ...this.getCommonTraineeData()
      },
      gradeData: {
        id: selectedTraineesRowData.gradeId,
        ...this.getCommonGradeData(),
        traineeId: selectedTraineesRowData.id
      }
    };
  }

  getCommonTraineeData(): TraineeCreateData {
    if (!this.traineeForm.value || !this.traineeForm.value.name || !this.traineeForm.value.email || !this.traineeForm.value.address || !this.traineeForm.value.city || !this.traineeForm.value.country || !this.traineeForm.value.dateJoined || !this.traineeForm.value.zip) throw this.errorService.throwError("Trainee Form values are not defined");
    console.log(this.traineeForm.value);
    if (typeof this.traineeForm.value.dateJoined === "string") throw this.errorService.throwError("Trainee Form dateJoined is not a date");
    return {
      name: this.traineeForm.value.name,
      email: this.traineeForm.value.email,
      dateJoined: this.traineeForm.value.dateJoined.toJSON(),
      address: this.traineeForm.value.address,
      city: this.traineeForm.value.city,
      country: this.traineeForm.value.country,
      zip: this.traineeForm.value.zip,
    }
  }

  getCommonGradeData(): Omit<TraineeGrade, "id" | "traineeId"> {
    if (!this.traineeForm.value || !this.traineeForm.value.grade || !this.traineeForm.value.subject || !this.traineeForm.value.dateJoined) throw this.errorService.throwError("Trainee Form values are not defined");
    if (typeof this.traineeForm.value.dateJoined === "string") throw this.errorService.throwError("Trainee Form dateJoined is not a date");
    return {
      grade: this.traineeForm.value.grade,
      subject: this.traineeForm.value.subject,
      date: this.traineeForm.value.dateJoined.toJSON(),
    }
  }

  populateSelectedTraineeRow(): TraineeRow {
    const selectedTraineesRowData = this.selectedTraineesRow();
    if (!selectedTraineesRowData) throw this.errorService.throwError("Selected Trainees Row is not defined");
    if (!this.traineeForm.value || !this.traineeForm.value.grade || !this.traineeForm.value.subject) throw this.errorService.throwError("Trainee Form values are not defined");
    return {
      id: selectedTraineesRowData.id,
      gradeId: selectedTraineesRowData.gradeId,
      ...this.getCommonTraineeData(),
      grade: this.traineeForm.value.grade,
      gradeDate: selectedTraineesRowData.gradeDate,
      subject: this.traineeForm.value.subject,
    }
  }

  resetForm(): void {
    this.traineeForm.reset();
    this.traineeFormDirective().resetForm();
    this.isFormSubmitted.set(false);
  }
}
