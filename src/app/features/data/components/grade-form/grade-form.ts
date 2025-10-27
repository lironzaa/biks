import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { NumberInput } from '../../../../shared/components/inputs/number-input/number-input';
import { SelectInput } from '../../../../shared/components/inputs/select-input/select-input';
import { DateInput } from '../../../../shared/components/inputs/date-input/date-input';
import { Button } from '../../../../shared/components/buttons/button/button';
import { GradeCreateData } from '../../types/trainee-type';
import { createTraineeGrade } from '../../store/trainees.actions';
import { SubjectType } from '../../types/subject-type';
import { ErrorService } from '../../../../shared/services/error/error.service';
import { SubjectTypeOptions } from '../../data/subject-type-options';

@Component({
  selector: 'app-grade-form',
  imports: [
    ReactiveFormsModule,
    NumberInput,
    SelectInput,
    DateInput,
    Button,
  ],
  templateUrl: './grade-form.html',
  styleUrl: './grade-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeForm {
  fb = inject(FormBuilder);
  store = inject(Store);
  errorService = inject(ErrorService);

  gradeForm = this.fb.group({
    "grade": new FormControl<number | null>(null, [ Validators.required, Validators.min(0), Validators.max(100) ]),
    "subject": new FormControl<SubjectType | null>(null, [ Validators.required ]),
    "date": new FormControl<string | Date | null>(null, [ Validators.required ]),
    "traineeId": new FormControl<string>("", [ Validators.required ]),
  });
  subjectTypeOptions = signal(SubjectTypeOptions);
  isFormSubmitted = signal(false);

  @ViewChild("gradeFormDirective") gradeFormDirective!: FormGroupDirective;

  onSubmitGradeForm(): void {
    this.isFormSubmitted.set(true);
    console.log(this.gradeForm);
    if (this.gradeForm.valid) {
      const gradeData: GradeCreateData = this.populateCreateGradeData();
      this.store.dispatch(createTraineeGrade({ data: gradeData }));
      this.resetForm();
      // this.gradeForm.get("traineeId")?.setValue(this.selectedTraineesRow()!.id);
    }
  }

  populateCreateGradeData(): GradeCreateData {
    if (!this.gradeForm.value || !this.gradeForm.value.grade || !this.gradeForm.value.subject || !this.gradeForm.value.date || !this.gradeForm.value.traineeId) throw this.errorService.throwError("Grade Form values are not defined");
    if (typeof this.gradeForm.value.date === "string") throw this.errorService.throwError("Grade Form date is not a date");
    return {
      grade: this.gradeForm.value.grade,
      subject: this.gradeForm.value.subject,
      date: this.gradeForm.value.date.toJSON(),
      traineeId: this.gradeForm.value.traineeId
    };
  }

  resetForm(): void {
    this.gradeForm.reset();
    this.gradeFormDirective.resetForm();
  }
}
