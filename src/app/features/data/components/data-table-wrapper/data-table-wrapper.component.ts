import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

import { filterTrainees, setSelectedTraineeRow } from "../../store/trainees.actions";
import { DataFiltersQueryParams } from "../../interfaces/data-filters-query-params.interface";
import * as fromApp from "../../../../core/store/app.reducer";
import { selectTrainees } from "../../store/trainees.selectors";
import { TraineesState } from "../../store/trainees.reducer";
import { DataTableFiltersValues, DataTableItem } from "../../../../shared/interfaces/data-table-interface";
import { dataTableConfig } from "../../data/data-table-config";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { TraineeRow } from "../../interfaces/trainee-interface";
import { GradeRangeOptions } from "../../data/grade-range-options";

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
  gradeRangeOptions = GradeRangeOptions;

  dataFiltersForm = this.fb.group({
    "id": new FormControl<string>(""),
    "grade": new FormControl<string>(""),
    "gradeRange": new FormControl<string>(""),
    "startDate": new FormControl<string | Date>(""),
    "endDate": new FormControl<string | Date>(""),
  });

  filtersFormSub!: Subscription;
  queryParamsSub!: Subscription;
  storeSub!: Subscription;

  constructor(private store: Store<fromApp.AppState>, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute,
              protected formUtilitiesService: FormUtilitiesService, private toastr: ToastrService) {
    this.traineesState$ = store.select(selectTrainees);
  }

  ngOnInit(): void {
    // console.log("DataTableWrapperComponent on init");
    this.storeSub = this.store.select(selectTrainees).subscribe((traineesState: TraineesState) => {
      this.traineesState = traineesState;
      // console.log(this.traineesState);
    });
    this.patchFiltersFormValue();
    this.initQueryParamsSub();
    this.initFiltersFormSub();
  }

  initFiltersFormSub(): void {
    this.filtersFormSub = this.dataFiltersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map(formValues => this.formatSearchFormValues(formValues))
      ).subscribe(formattedSearchValues => {
        const queryParams = formattedSearchValues.formValues;
        const isResetPage = formattedSearchValues.isResetPage;
        // console.log(queryParams);
        // console.log("isResetPage " + isResetPage);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { ...queryParams, page: isResetPage ? 1 : this.route.snapshot.queryParams.page },
          queryParamsHandling: "merge",
        });
      })
  }

  patchFiltersFormValue(): void {
    const queryParamsValue: DataFiltersQueryParams = { ...this.route.snapshot.queryParams };
    // console.log(queryParamsValue);
    if (queryParamsValue.startDate) queryParamsValue.startDate = new Date(queryParamsValue.startDate);
    if (queryParamsValue.endDate) queryParamsValue.endDate = new Date(queryParamsValue.endDate);
    this.dataFiltersForm.patchValue(queryParamsValue);
  }

  initQueryParamsSub(): void {
    this.queryParamsSub = this.route.queryParams.subscribe((queryParams) => {
      // console.log(queryParams);
      const isApplyFilters = this.isApplyFilters(queryParams);
      // console.log(isApplyFilters);
      if (isApplyFilters) this.applyFilters(queryParams);
    });
  }

  isApplyFilters(queryParams: DataFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === "id" || filter === "grade" || filter === "startDate" || filter === "endDate") {
        return true;
      }
    }
    // const paginationData = this.paginationDataService.calculatePaginationData(1, this.traineesState.traineesRowsOrigin.length);
    // this.paginationDataService.setPaginationData(paginationData);
    // console.log(paginationData);
    this.store.dispatch(filterTrainees({ traineesRows: this.traineesState.traineesRowsOrigin }));
    return false;
  }

  applyFilters(queryParams: DataFiltersQueryParams): void {
    // console.log(queryParams);
    const filteredItems = this.traineesState.traineesRowsOrigin.filter(item => {
      let idMatch = true;
      let gradeMatch = true;
      let dateMatch = true;

      if (queryParams.id !== undefined) {
        idMatch = item.id === queryParams.id;
      }

      if (queryParams.grade !== undefined) {
        if (queryParams.gradeRange === undefined) {
          gradeMatch = item.grade === queryParams.grade;
        } else {
          gradeMatch = this.compareAccordingToOperator(item.grade, queryParams.gradeRange, queryParams.grade);
        }
      }

      if (queryParams.startDate !== undefined && queryParams.endDate !== undefined) {
        const itemDate = new Date(item.dateJoined);
        dateMatch = new Date(queryParams.startDate) <= itemDate && itemDate <= new Date(queryParams.endDate);
      }

      return idMatch && gradeMatch && dateMatch;
    })
    console.log(filteredItems);
    // const paginationData = this.paginationDataService.calculatePaginationData(1, filteredItems.length);
    // this.paginationDataService.setPaginationData(paginationData);
    this.store.dispatch(filterTrainees({ traineesRows: filteredItems }));
  }

  compareAccordingToOperator(grade: string, gradeRange: string, queryParamsGrade: string): boolean {
    switch (gradeRange) {
      case ">":
        return grade > queryParamsGrade!;
      case "<":
        return grade < queryParamsGrade!;
      case "===":
        return grade === queryParamsGrade!;
      default:
        this.toastr.error("An error occurred");
        return false;
    }
  }

  formatSearchFormValues(formValues: DataTableFiltersValues): {
    formValues: DataTableFiltersValues;
    isResetPage: boolean
  } {
    console.log(formValues);
    let isResetPage = true;
    for (const value in formValues) {
      if (formValues[value] === "") {
        formValues[value] = null;
        isResetPage = false;
      }
    }
    console.log(formValues);
    return { formValues, isResetPage };
  }

  onTableRowClick(item: DataTableItem): void {
    const traineeRow: TraineeRow = item as unknown as TraineeRow;
    this.store.dispatch(setSelectedTraineeRow({ traineeRow }));
  }

  ngOnDestroy(): void {
    if (!this.filtersFormSub?.closed) this.filtersFormSub.unsubscribe();
    if (!this.queryParamsSub?.closed) this.queryParamsSub.unsubscribe();
    if (!this.storeSub?.closed) this.storeSub.unsubscribe();
  }
}
