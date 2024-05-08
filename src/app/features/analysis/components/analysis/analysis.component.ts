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

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrl: "./analysis.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisComponent implements OnInit, OnDestroy {
  traineesStateIds$: Observable<string[]>;
  gradesAveragesForSelectedSubjects$: Observable<{ [key: string]: number }>;
  gradesAveragesForSelectedTrainees$: Observable<{ [key: string]: number }>;
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
    this.gradesAveragesForSelectedSubjects$ = store.select(selectGradesAveragesForSelectedSubjects);
    this.gradesAveragesForSelectedTrainees$ = store.select(selectGradesAveragesForSelectedTrainees);
  }

  ngOnInit(): void {
    // this.storeSub = this.store.select(selectTrainees).subscribe((traineesState: TraineesState) => {
      // this.traineesState = traineesState;
      // console.log(traineesState);
    // });
    this.idsSub = this.analysisForm.get("ids")?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((selectedIds) => {
      console.log(selectedIds);
      this.store.dispatch(setSelectedTraineesIds({ traineesIds: selectedIds! }));
    })
    this.subjectsSub = this.analysisForm.get("subjects")?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((selectedSubjects) => {
      this.store.dispatch(setSelectedSubjects({ selectedSubjects: selectedSubjects! }));
    })
  }

  ngOnDestroy(): void {
    // if (!this.storeSub.closed) this.storeSub.unsubscribe();
    if (this.idsSub && !this.idsSub.closed) this.idsSub.unsubscribe();
    if (this.subjectsSub && !this.subjectsSub.closed) this.subjectsSub.unsubscribe();
  }
}
