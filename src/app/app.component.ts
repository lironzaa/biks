import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";

import { getTrainees } from "./features/data/store/trainees.actions";
import { DataFiltersQueryParams } from "./features/data/interfaces/data-filters-query-params.interface";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  route = inject(ActivatedRoute);
  store = inject(Store);

  title = "biks";

  ngOnInit(): void {
    this.store.dispatch(getTrainees({ queryParams: this.route.snapshot.queryParams as DataFiltersQueryParams }));
  }
}
