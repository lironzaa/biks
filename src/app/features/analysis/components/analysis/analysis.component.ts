import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { distinctUntilChanged, Observable, takeUntil } from "rxjs";

import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { SubjectTypeOptions } from "../../../data/data/subject-type-options";
import { traineesFeature } from "../../../data/store/trainees.reducer";
import { setSelectedSubjects, setSelectedTraineesIds } from "../../../data/store/trainees.actions";
import { SubjectType } from "../../../data/types/subject-type";
import { ChartSubjectsGradesAverages, ChartTraineesGradesAverages } from "../../analysis-charts-interface";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrl: "./analysis.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisComponent extends Unsubscribe implements OnInit {
  formUtilitiesService = inject(FormUtilitiesService);
  store = inject(Store);
  fb = inject(FormBuilder);

  traineesStateIds$ = new Observable<string[]>;
  traineesGradesAverages$ = new Observable<ChartTraineesGradesAverages[]>;
  subjectsGradesAverages$ = new Observable<Partial<ChartSubjectsGradesAverages>>;
  subjectTypeOptions = SubjectTypeOptions;

  analysisForm = this.fb.group({
    "ids": new FormControl<string[]>([]),
    "subjects": new FormControl<SubjectType[]>([]),
  });

  ngOnInit(): void {
    this.initStoreSelects();
    this.initValueChangesSubs();
  }

  initStoreSelects(): void {
    this.traineesStateIds$ = this.store.select(traineesFeature.selectTraineesIds);
    this.traineesGradesAverages$ = this.store.select(traineesFeature.selectGradesAveragesForSelectedTrainees);
    this.subjectsGradesAverages$ = this.store.select(traineesFeature.selectGradesAveragesForSelectedSubjects);
  }

  initValueChangesSubs(): void {
    this.analysisForm.get("ids")?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe((selectedIds) => {
      this.store.dispatch(setSelectedTraineesIds({ traineesIds: selectedIds! }));
    })
    this.analysisForm.get("subjects")?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe((selectedSubjects) => {
      this.store.dispatch(setSelectedSubjects({ selectedSubjects: selectedSubjects! }));
    })
  }

  trackByTrainee(index: number, item: ChartTraineesGradesAverages): string {
    return item.trainee.id;
  }
}
