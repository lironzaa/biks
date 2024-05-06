import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import * as fromApp from "../../../../core/store/app.reducer";
import { getTrainees } from "../../store/trainees.actions";
import { selectTrainees } from "../../store/trainees.selectors";
import { TraineesState } from "../../store/trainees.reducer";
import { DataFiltersQueryParams } from "../../interfaces/data-filters-query-params.interface";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrl: "./data.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataComponent implements OnInit {
  traineesState$: Observable<TraineesState>;

  constructor(private store: Store<fromApp.AppState>, private route: ActivatedRoute) {
    this.traineesState$ = store.select(selectTrainees);
  }

  ngOnInit(): void {
    this.store.dispatch(getTrainees(this.route.snapshot.queryParams as DataFiltersQueryParams));
  }
}
