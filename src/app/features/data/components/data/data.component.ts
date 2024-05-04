import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import * as fromApp from "../../../../core/store/app.reducer";
import { getTrainees } from "../../store/trainees.actions";
import { selectTrainees } from "../../store/trainees.selectors";
import { dataTableConfig } from "../../data/data-table-config";
import { TraineesState } from "../../store/trainees.reducer";
import { DataTableFiltersValues } from "../../../../shared/interfaces/data-table-interface";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrl: "./data.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataComponent implements OnInit, OnDestroy {
  trainees$: Observable<TraineesState>;
  tableConfig = dataTableConfig;

  dataFiltersForm = this.fb.group({
    "id": new FormControl<string>(""),
    "grade": new FormControl<string>(""),
    // "date": new FormControl<string | []>(""),
    "date": new FormControl<string>(""),
  });

  filtersFormSub!: Subscription;

  constructor(private store: Store<fromApp.AppState>, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
    this.trainees$ = store.select(selectTrainees);
  }

  ngOnInit(): void {
    // this.patchClientsSearchFormValue();
    this.store.dispatch(getTrainees());
    this.initFiltersFormSub();
  }

  initFiltersFormSub(): void {
    this.filtersFormSub = this.dataFiltersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map(formValues => this.formatSearchFormValues(formValues))
      ).subscribe(queryParams => {
        console.log(queryParams);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { ...queryParams, page: 1 },
          queryParamsHandling: "merge",
        });
      })
  }

  formatSearchFormValues(formValues: DataTableFiltersValues): DataTableFiltersValues {
    // console.log(formValues);
    for (const value in formValues) {
      // console.log(value);
      // console.log(formValues[value]);
      // if (Array.isArray(formValues[value]) && formValues[value][0] instanceof Date) formValues[value] = [ formValues[value][0].toLocaleString([ "sv-SE" ]).split(" ")[0], formValues[value][1].toLocaleString([ "sv-SE" ]).split(" ")[0] ];
      // if (formValues[value] instanceof Date) formValues[value] = new Date(formValues[value]).toLocaleString([ "sv-SE" ]).split(" ")[0];
      if (formValues[value] === "") formValues[value] = null;
    }
    return formValues;
  }

  ngOnDestroy(): void {
    if (!this.filtersFormSub?.closed) this.filtersFormSub.unsubscribe();
  }
}
