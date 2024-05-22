import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, Observable, skip, takeUntil } from "rxjs";
import { map } from "rxjs/operators";

import { filterTraineesRows, setSelectedTraineeRow } from "../../store/trainees.actions";
import { traineesFeature, TraineesState } from "../../store/trainees.reducer";
import { DataFiltersQueryParams } from "../../interfaces/data-filters-query-params.interface";
import { DataTableFiltersValues, DataTableItem } from "../../../../shared/interfaces/data-table-interface";
import { TraineeRow } from "../../interfaces/trainee-interface";
import { dataTableConfig } from "../../data/data-table-config";
import { GradeRangeOptions } from "../../data/grade-range-options";
import { DataFiltersEnum } from "../../enums/data-filters-enum";
import { GradeRangeEnum } from "../../enums/grade-range-enum";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { PaginationDataService } from "../../../../shared/services/pagination-data.service";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";
import { GradeRangeType } from "../../types/grade-range-type";

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

  dataFiltersForm = this.fb.group({
    "id": new FormControl<string>(""),
    "grade": new FormControl<number | null>(null),
    "gradeRange": new FormControl<GradeRangeType>({
      value: GradeRangeEnum.equals,
      disabled: !this.route.snapshot.queryParams["grade"]
    }),
    "startDate": new FormControl<string | Date>(""),
    "endDate": new FormControl<string | Date>(""),
  });

  gradeRangeControl = this.dataFiltersForm.get("gradeRange");

  constructor(private store: Store, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute,
              protected formUtilitiesService: FormUtilitiesService, private paginationDataService: PaginationDataService) {
    super();
    this.traineesState$ = store.select(traineesFeature.selectTraineesState);
  }

  ngOnInit(): void {
    this.store.select(traineesFeature.selectTraineesRowsOrigin).pipe(takeUntil(this.unsubscribe$))
      .subscribe((traineesRowsOrigin: TraineeRow[]) => this.traineesRowsOrigin = traineesRowsOrigin);
    this.patchFiltersFormValue();
    this.initQueryParamsSub();
    this.initFiltersFormSub();
  }

  patchFiltersFormValue(): void {
    const queryParamsValue: DataFiltersQueryParams = { ...this.route.snapshot.queryParams };
    if (queryParamsValue.startDate) queryParamsValue.startDate = new Date(queryParamsValue.startDate);
    if (queryParamsValue.endDate) queryParamsValue.endDate = new Date(queryParamsValue.endDate);
    if (queryParamsValue.grade) queryParamsValue.grade = Number(queryParamsValue.grade);
    this.dataFiltersForm.patchValue(queryParamsValue);
  }

  initFiltersFormSub(): void {
    this.dataFiltersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map(formValues => {
          if (formValues.grade === null) formValues.gradeRange = null;
          return this.formatSearchFormToQueryParams(formValues);
        }),
        skip(1),
        takeUntil(this.unsubscribe$)
      ).subscribe(formattedFiltersValues => {
      const updatedQueryParams = formattedFiltersValues.formatedQueryParams;
      this.setGrandeRangeIsDisabled(updatedQueryParams.grade);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          ...updatedQueryParams,
          page: formattedFiltersValues.isResetPage ? 1 : this.route.snapshot.queryParams.page
        },
        queryParamsHandling: "merge",
      });
    })
  }

  formatSearchFormToQueryParams(formValues: DataTableFiltersValues): {
    formatedQueryParams: DataFiltersQueryParams;
    isResetPage: boolean
  } {
    let isResetPage = false;
    for (const value in formValues) {
      if (formValues[value] === "" || formValues[value] === null) formValues[value] = null;
      else isResetPage = true;
    }
    return { formatedQueryParams: formValues, isResetPage };
  }

  initQueryParamsSub(): void {
    this.route.queryParams.subscribe((queryParams) => {
      const isApplyFilters = this.isApplyFilters(queryParams);
      if (isApplyFilters) this.applyFiltersOnData(queryParams);
      else this.resetDataToOrigin();
    });
  }

  resetDataToOrigin(): void {
    this.setPaginationData(this.traineesRowsOrigin.length);
    this.store.dispatch(filterTraineesRows({ traineesRows: this.traineesRowsOrigin }));
  }

  setPaginationData(itemsLength: number): void {
    const paginationData = this.paginationDataService.calculatePaginationData(this.route.snapshot.queryParams.page ? +this.route.snapshot.queryParams.page : 1, itemsLength);
    this.paginationDataService.setPaginationData(paginationData);
  }

  isApplyFilters(queryParams: DataFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === DataFiltersEnum.id || filter === DataFiltersEnum.grade || filter === DataFiltersEnum.startDate || filter === DataFiltersEnum.endDate) return true;
    }
    return false;
  }

  applyFiltersOnData(queryParams: DataFiltersQueryParams): void {
    let startDate: Date;
    let endDate: Date;
    const isFilterByDate = queryParams.startDate !== undefined && queryParams.endDate !== undefined;
    if (isFilterByDate) {
      startDate = new Date(queryParams.startDate!);
      endDate = new Date(queryParams.endDate!);
    }

    let gradeQueryParam: number;
    const isFilterByGrade = queryParams.grade !== undefined;
    if (isFilterByGrade) gradeQueryParam = Number(queryParams.grade);

    const isFilterById = queryParams.id !== undefined;

    const filteredItems = this.traineesRowsOrigin.filter(item => {
      let idMatch = true;
      let gradeMatch = true;
      let dateMatch = true;

      if (isFilterById) idMatch = item.id === queryParams.id;

      if (isFilterByGrade) gradeMatch = this.compareAccordingToOperator(item.grade, queryParams.gradeRange, gradeQueryParam);

      if (isFilterByDate) {
        const itemDate = new Date(item.gradeDate);
        dateMatch = startDate <= itemDate && itemDate <= endDate;
      }

      return idMatch && gradeMatch && dateMatch;
    })
    this.setPaginationData(filteredItems.length);
    this.store.dispatch(filterTraineesRows({ traineesRows: filteredItems }));
  }

  setGrandeRangeIsDisabled(grade: number | null | undefined): void {
    if (typeof grade === "number") this.gradeRangeControl?.enable({ emitEvent: false });
    else this.gradeRangeControl?.disable({ emitEvent: false });
  }

  compareAccordingToOperator(grade: number, gradeRange: string | undefined, queryParamsGrade: number): boolean {
    switch (gradeRange) {
      case GradeRangeEnum.greaterThan:
        return grade > queryParamsGrade!;
      case GradeRangeEnum.lessThan:
        return grade < queryParamsGrade!;
      case GradeRangeEnum.equals:
      default:
        return grade === queryParamsGrade!;
    }
  }

  onTableRowClick(item: DataTableItem): void {
    const traineeRow: TraineeRow = item as unknown as TraineeRow;
    this.store.dispatch(setSelectedTraineeRow({ traineeRow }));
  }

  resetFilters(): void {
    this.dataFiltersForm.reset();
    this.gradeRangeControl?.patchValue(GradeRangeEnum.equals);
    this.gradeRangeControl?.disable({ emitEvent: false })
  }
}
