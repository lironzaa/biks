import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { distinctUntilChanged, Observable, Subscription } from "rxjs";

import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { SubjectTypeOptions } from "../../../data/data/subject-type-options";
import * as fromApp from "../../../../core/store/app.reducer";
import {
  selectGradesAveragesForSelectedSubjects,
  selectGradesAveragesForSelectedTrainees,
  // selectTrainees,
  selectTraineesIds
} from "../../../data/store/trainees.selectors";
// import { TraineesState } from "../../../data/store/trainees.reducer";
import { setSelectedSubjects, setSelectedTraineesIds } from "../../../data/store/trainees.actions";
import { SubjectType } from "../../../data/types/subject-type";
import { ChartSubjectsGradesAverages, ChartTraineesGradesAverages } from "../../analysis-charts-interface";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrl: "./analysis.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisComponent implements OnInit, OnDestroy {
  traineesStateIds$: Observable<string[]>;
  traineesGradesAverages$: Observable<ChartTraineesGradesAverages[]>;
  subjectsGradesAverages$: Observable<ChartSubjectsGradesAverages>;
  // traineesState!: TraineesState;
  subjectTypeOptions = SubjectTypeOptions;

  analysisForm = this.fb.group({
    "ids": new FormControl<string[]>([]),
    "subjects": new FormControl<SubjectType[]>([]),
  });

  // storeSub!: Subscription;
  idsSub: Subscription | undefined;
  subjectsSub: Subscription | undefined;

  constructor(protected formUtilitiesService: FormUtilitiesService, private fb: FormBuilder,
              private store: Store<fromApp.AppState>) {
    this.traineesStateIds$ = store.select(selectTraineesIds);
    this.traineesGradesAverages$ = store.select(selectGradesAveragesForSelectedTrainees);
    this.subjectsGradesAverages$ = store.select(selectGradesAveragesForSelectedSubjects);
  }

  ngOnInit(): void {
    // this.storeSub = this.store.select(selectTrainees).subscribe((traineesState: TraineesState) => {
    // this.traineesState = traineesState;
    // console.log(traineesState);
    // });
    this.idsSub = this.analysisForm.get("ids")?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((selectedIds) => {
      this.store.dispatch(setSelectedTraineesIds({ traineesIds: selectedIds! }));
    })
    this.subjectsSub = this.analysisForm.get("subjects")?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((selectedSubjects) => {
      this.store.dispatch(setSelectedSubjects({ selectedSubjects: selectedSubjects! }));
    })
  }

  trackByTrainee(index: number, item: ChartTraineesGradesAverages): string {
    return item.trainee.id;
  }

  ngOnDestroy(): void {
    // if (!this.storeSub.closed) this.storeSub.unsubscribe();
    if (this.idsSub && !this.idsSub.closed) this.idsSub.unsubscribe();
    if (this.subjectsSub && !this.subjectsSub.closed) this.subjectsSub.unsubscribe();
  }
}
