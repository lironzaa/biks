import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, Observable, takeUntil } from "rxjs";
import { map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

import { filterTraineesRows, setSelectedTraineeRow } from "../../store/trainees.actions";
import { DataFiltersQueryParams } from "../../interfaces/data-filters-query-params.interface";
import * as fromApp from "../../../../core/store/app.reducer";
import { selectTraineesRowsOrigin, selectTraineesState } from "../../store/trainees.selectors";
import { TraineesState } from "../../store/trainees.reducer";
import { DataTableFiltersValues, DataTableItem } from "../../../../shared/interfaces/data-table-interface";
import { dataTableConfig } from "../../data/data-table-config";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { TraineeRow } from "../../interfaces/trainee-interface";
import { GradeRangeOptions } from "../../data/grade-range-options";
import { PaginationDataService } from "../../../../shared/services/pagination-data.service";
import { DataFiltersEnum } from "../../enums/data-filters-enum";
import { GradeRangeEnum } from "../../enums/grade-range-enum";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";

@Component({
  selector: "app-data-table-wrapper",
  templateUrl: "./data-table-wrapper.component.html",
  styleUrl: "./data-table-wrapper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableWrapperComponent extends Unsubscribe implements OnInit {
  traineesState$: Observable<TraineesState>;
  tableConfig = dataTableConfig;
  traineesRowsOrigin!: TraineeRow[];
  gradeRangeOptions = GradeRangeOptions;
  isInitialRender = true;
  isResetPage = false;

  dataFiltersForm = this.fb.group({
    "id": new FormControl<string>(""),
    "grade": new FormControl<string>(""),
    "gradeRange": new FormControl<string>(""),
    "startDate": new FormControl<string | Date>(""),
    "endDate": new FormControl<string | Date>(""),
  });

  constructor(private store: Store<fromApp.AppState>, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute,
              protected formUtilitiesService: FormUtilitiesService, private toastr: ToastrService,
              private paginationDataService: PaginationDataService) {
    super();
    this.traineesState$ = store.select(selectTraineesState);
  }

  ngOnInit(): void {
    this.store.select(selectTraineesRowsOrigin).pipe(takeUntil(this.unsubscribe$))
      .subscribe((traineesRowsOrigin: TraineeRow[]) => this.traineesRowsOrigin = traineesRowsOrigin);
    this.patchFiltersFormValue();
    this.initQueryParamsSub();
    this.initFiltersFormSub();
  }

  patchFiltersFormValue(): void {
    const queryParamsValue: DataFiltersQueryParams = { ...this.route.snapshot.queryParams };
    if (queryParamsValue.startDate) queryParamsValue.startDate = new Date(queryParamsValue.startDate);
    if (queryParamsValue.endDate) queryParamsValue.endDate = new Date(queryParamsValue.endDate);
    this.dataFiltersForm.patchValue(queryParamsValue);
  }

  initQueryParamsSub(): void {
    this.route.queryParams.subscribe((queryParams) => {
      const isApplyFilters = this.isApplyFilters(queryParams);
      if (isApplyFilters) {
        this.applyFilters(queryParams);
      } else {
        const paginationData = this.paginationDataService.calculatePaginationData(this.route.snapshot.queryParams.page ? +this.route.snapshot.queryParams.page : 1, this.traineesRowsOrigin.length);
        this.paginationDataService.setPaginationData(paginationData);
      }
    });
  }

  isApplyFilters(queryParams: DataFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === DataFiltersEnum.id || filter === DataFiltersEnum.grade || filter === DataFiltersEnum.startDate || filter === DataFiltersEnum.endDate) {
        return true;
      }
    }
    if (this.isResetPage) {
      const paginationData = this.paginationDataService.calculatePaginationData(1, this.traineesRowsOrigin.length);
      this.paginationDataService.setPaginationData(paginationData);
      this.isResetPage = false;
    }
    this.store.dispatch(filterTraineesRows({ traineesRows: this.traineesRowsOrigin }));
    return false;
  }

  applyFilters(queryParams: DataFiltersQueryParams): void {
    let startDate: Date;
    let endDate: Date;
    const isFilterByDate = queryParams.startDate !== undefined && queryParams.endDate !== undefined;
    if (isFilterByDate) {
      startDate = new Date(queryParams.startDate!);
      endDate = new Date(queryParams.endDate!);
    }
    const filteredItems = this.traineesRowsOrigin.filter(item => {
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

      if (isFilterByDate) {
        const itemDate = new Date(item.gradeDate);
        dateMatch = startDate <= itemDate && itemDate <= endDate;
      }

      return idMatch && gradeMatch && dateMatch;
    })
    if (queryParams.page === "1") {
      const paginationData = this.paginationDataService.calculatePaginationData(1, filteredItems.length);
      this.paginationDataService.setPaginationData(paginationData);
    }
    this.store.dispatch(filterTraineesRows({ traineesRows: filteredItems }));
  }

  initFiltersFormSub(): void {
    this.dataFiltersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map(formValues => this.formatSearchFormValues(formValues)),
        takeUntil(this.unsubscribe$)
      ).subscribe(formattedSearchValues => {
      const queryParams = formattedSearchValues.formValues;
      this.isResetPage = !this.isInitialRender && formattedSearchValues.isResetPage;
      this.isInitialRender = false;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...queryParams, page: this.isResetPage ? 1 : this.route.snapshot.queryParams.page },
        queryParamsHandling: "merge",
      });
    })
  }

  formatSearchFormValues(formValues: DataTableFiltersValues): {
    formValues: DataTableFiltersValues;
    isResetPage: boolean
  } {
    let isResetPage = false;
    for (const value in formValues) {
      if (formValues[value] === "") {
        formValues[value] = null;
      } else {
        isResetPage = true;
      }
    }
    return { formValues, isResetPage };
  }

  compareAccordingToOperator(grade: string, gradeRange: string, queryParamsGrade: string): boolean {
    switch (gradeRange) {
      case GradeRangeEnum.greaterThan:
        return grade > queryParamsGrade!;
      case GradeRangeEnum.lessThan:
        return grade < queryParamsGrade!;
      case GradeRangeEnum.equals:
        return grade === queryParamsGrade!;
      default:
        this.toastr.error("An error occurred");
        return false;
    }
  }

  onTableRowClick(item: DataTableItem): void {
    const traineeRow: TraineeRow = item as unknown as TraineeRow;
    this.store.dispatch(setSelectedTraineeRow({ traineeRow }));
  }

  resetFilters(): void {
    this.dataFiltersForm.reset();
  }
}
