import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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
  traineesStateIds$: Observable<string[]>;
  traineesGradesAverages$: Observable<ChartTraineesGradesAverages[]>;
  subjectsGradesAverages$: Observable<Partial<ChartSubjectsGradesAverages>>;
  subjectTypeOptions = SubjectTypeOptions;

  analysisForm = this.fb.group({
    "ids": new FormControl<string[]>([]),
    "subjects": new FormControl<SubjectType[]>([]),
  });

  constructor(protected formUtilitiesService: FormUtilitiesService, private fb: FormBuilder,
              private store: Store) {
    super();
    this.traineesStateIds$ = store.select(traineesFeature.selectTraineesIds);
    this.traineesGradesAverages$ = store.select(traineesFeature.selectGradesAveragesForSelectedTrainees);
    this.subjectsGradesAverages$ = store.select(traineesFeature.selectGradesAveragesForSelectedSubjects);
  }

  ngOnInit(): void {
    this.initValueChangesSubs();
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
