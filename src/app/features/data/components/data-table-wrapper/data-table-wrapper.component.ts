import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { filterTrainees, setSelectedTraineeRow } from "../../store/trainees.actions";
import { DataFiltersQueryParams } from "../../interfaces/data-filters-query-params.interface";
import * as fromApp from "../../../../core/store/app.reducer";
import { selectTrainees } from "../../store/trainees.selectors";
import { TraineesState } from "../../store/trainees.reducer";
import { DataTableFiltersValues, DataTableItem } from "../../../../shared/interfaces/data-table-interface";
import { dataTableConfig } from "../../data/data-table-config";
import { QueryParamsService } from "../../../../shared/services/query-params.service";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { TraineeRow } from "../../interfaces/trainee-interface";

@Component({
  selector: "app-data-table-wrapper",
  templateUrl: "./data-table-wrapper.component.html",
  styleUrl: "./data-table-wrapper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableWrapperComponent implements OnInit, OnDestroy {
  traineesState$: Observable<TraineesState>;
  tableConfig = dataTableConfig;
  traineesState!: TraineesState;

  dataFiltersForm = this.fb.group({
    "id": new FormControl<string>(""),
    "grade": new FormControl<string>(""),
    // "date": new FormControl<string | []>(""),
    "date": new FormControl<string>(""),
  });

  filtersFormSub!: Subscription;
  queryParamsSub!: Subscription;

  constructor(private store: Store<fromApp.AppState>, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute,
              private queryParamsService: QueryParamsService, protected formUtilitiesService: FormUtilitiesService) {
    this.traineesState$ = store.select(selectTrainees);
  }

  ngOnInit(): void {
    this.store.select(selectTrainees).subscribe((traineesState: TraineesState) => {
      this.traineesState = traineesState;
      // console.log(this.traineesState);
    });
    this.initFiltersFormSub();
    this.patchFiltersFormValue();
    this.initQueryParamsSub();
  }

  patchFiltersFormValue(): void {
    const queryParamsValue = { ...this.route.snapshot.queryParams };
    // if (queryParamsValue['eventDate']) {
    //   queryParamsValue['eventDate'] = !Array.isArray(queryParamsValue['eventDate']) ? new Date(queryParamsValue['eventDate']) : [ new Date(queryParamsValue['eventDate'][0]), new Date(queryParamsValue['eventDate'][1]) ];
    // }
    this.dataFiltersForm.patchValue(queryParamsValue);
  }

  initQueryParamsSub(): void {
    this.queryParamsSub = this.queryParamsService.getQueryParamChangedListener().subscribe(queryParams => {
      const isApplyFilters = this.isApplyFilters(queryParams);
      if (isApplyFilters) this.applyFilters(queryParams);
    })
  }

  isApplyFilters(queryParams: DataFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === "id" || filter === "grade" || filter === "date") {
        return true;
      }
    }
    this.store.dispatch(filterTrainees({ trainees: this.traineesState.traineesOrigin }));
    return false;
  }

  applyFilters(queryParams: DataFiltersQueryParams): void {
    console.log(this.traineesState.traineesOrigin);
    const filteredItems = this.traineesState.traineesOrigin.filter(item => {
      const idMatch = item.id === queryParams.id;
      console.log(idMatch);
      // const categoryMatch = !categoryFilter || item.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return idMatch;
      // return idMatch && categoryMatch;
    })
    console.log(filteredItems);
    this.store.dispatch(filterTrainees({ trainees: filteredItems }));
  }

  initFiltersFormSub(): void {
    this.filtersFormSub = this.dataFiltersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map(formValues => this.formatSearchFormValues(formValues))
      ).subscribe(queryParams => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { ...queryParams, page: 1 },
          queryParamsHandling: "merge",
        });
      })
  }

  formatSearchFormValues(formValues: DataTableFiltersValues): DataTableFiltersValues {
    for (const value in formValues) {
      // if (Array.isArray(formValues[value]) && formValues[value][0] instanceof Date) formValues[value] = [ formValues[value][0].toLocaleString([ "sv-SE" ]).split(" ")[0], formValues[value][1].toLocaleString([ "sv-SE" ]).split(" ")[0] ];
      // if (formValues[value] instanceof Date) formValues[value] = new Date(formValues[value]).toLocaleString([ "sv-SE" ]).split(" ")[0];
      if (formValues[value] === "") formValues[value] = null;
    }
    return formValues;
  }

  onTableRowClick(item: DataTableItem): void {
    const traineeRow: TraineeRow = item as unknown as TraineeRow;
    this.store.dispatch(setSelectedTraineeRow({ traineeRow }));
  }

  ngOnDestroy(): void {
    if (!this.filtersFormSub?.closed) this.filtersFormSub.unsubscribe();
    if (!this.queryParamsSub?.closed) this.queryParamsSub.unsubscribe();
  }
}
