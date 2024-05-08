import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";

import { getTrainees } from "./features/data/store/trainees.actions";
import { DataFiltersQueryParams } from "./features/data/interfaces/data-filters-query-params.interface";
import * as fromApp from "./core/store/app.reducer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = "biks";

  constructor(private store: Store<fromApp.AppState>, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.store.dispatch(getTrainees(this.route.snapshot.queryParams as DataFiltersQueryParams));
  }
}
