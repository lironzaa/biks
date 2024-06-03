import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, Observable, skip, takeUntil, withLatestFrom } from "rxjs";

import { setSelectedTraineeRow } from "../../store/trainees.actions";
import { traineesFeature, TraineesState } from "../../store/trainees.reducer";
import {
  DataFiltersFormPatchValues,
  DataFiltersQueryParams,
} from "../../interfaces/data-filters-query-params.interface";
import { DataTableItem } from "../../../../shared/interfaces/data-table-interface";
import { TraineeRow } from "../../interfaces/trainee-interface";
import { DataFiltersFormValues, FiltersFormState } from "../../interfaces/data-filters-form-values";
import { dataTableConfig } from "../../data/data-table-config";
import { GradeRangeOptions } from "../../data/grade-range-options";
import { DataFiltersEnum } from "../../enums/data-filters-enum";
import { GradeRangeEnum } from "../../enums/grade-range-enum";
import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { PaginationDataService } from "../../../../shared/services/pagination-data.service";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";
import { GradeRangeType } from "../../types/grade-range-type";
import { filterPartialDateRangeValue } from "../../custom-operators/custom-operators";
import { FilterFn } from "../../../../shared/types/filter-fn-type";

@Component({
  selector: "app-data-table-wrapper",
  templateUrl: "./data-table-wrapper.component.html",
  styleUrl: "./data-table-wrapper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableWrapperComponent extends Unsubscribe implements OnInit {
  formUtilitiesService = inject(FormUtilitiesService);
  store = inject(Store);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  paginationDataService = inject(PaginationDataService);

  traineesState$ = new Observable<TraineesState>();
  tableConfig = dataTableConfig;
  gradeRangeOptions = GradeRangeOptions;

  dataFiltersForm = this.fb.group({
    "id": new FormControl<string | null>(""),
    "grade": new FormControl<number | null>(null),
    "gradeRange": new FormControl<GradeRangeType | null>({
      value: GradeRangeEnum.equals,
      disabled: !this.route.snapshot.queryParams["grade"]
    }),
    "dateRange": this.fb.group({
      "startDate": new FormControl<string | Date>(""),
      "endDate": new FormControl<string | Date>(""),
    })
  });

  gradeRangeControl = this.dataFiltersForm.get("gradeRange");
  dateRangeGroup = this.dataFiltersForm.get("dateRange") as FormGroup;

  filterFn: FilterFn | undefined;
  paginationData$ = this.paginationDataService.getPaginationDataListener();

  ngOnInit(): void {
    this.initStoreSelect();
    this.patchFiltersFormValue();
    this.initQueryParamsSub();
    this.initFiltersFormSub();
  }

  initStoreSelect(): void {
    this.traineesState$ = this.store.select(traineesFeature.selectTraineesState);
  }

  patchFiltersFormValue(): void {
    const dataFiltersQueryParams: DataFiltersQueryParams = { ...this.route.snapshot.queryParams };
    const dataFiltersQueryParamsPatchValues: DataFiltersFormPatchValues = {
      ...(dataFiltersQueryParams.page && { page: dataFiltersQueryParams.page }),
      ...(dataFiltersQueryParams.id && { id: dataFiltersQueryParams.id }),
      ...(dataFiltersQueryParams.grade && { grade: Number(dataFiltersQueryParams.grade) }),
      ...(dataFiltersQueryParams.gradeRange && { gradeRange: dataFiltersQueryParams.gradeRange }),
      ...(dataFiltersQueryParams.startDate && dataFiltersQueryParams.endDate && {
        dateRange: {
          startDate: new Date(dataFiltersQueryParams.startDate),
          endDate: new Date(dataFiltersQueryParams.endDate),
        }
      }),
    }
    this.dataFiltersForm.patchValue(dataFiltersQueryParamsPatchValues);
  }

  initFiltersFormSub(): void {
    this.dataFiltersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        filterPartialDateRangeValue(),
        skip(1),
        takeUntil(this.unsubscribe$)
      ).subscribe(filtersFormValues => {
      const filtersFormState: FiltersFormState = this.generateFormState(filtersFormValues);
      this.setGrandeRangeIsDisabled(filtersFormState.updatedQueryParams.grade);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          ...filtersFormState.updatedQueryParams,
          page: filtersFormState.isResetPage ? 1 : this.route.snapshot.queryParams.page
        },
        queryParamsHandling: "merge",
      });
    })
  }

  generateFormState(filtersFormValues: Partial<DataFiltersFormValues>): FiltersFormState {
    const updatedQueryParams: DataFiltersQueryParams = {};
    let isResetPage = false;
    if (filtersFormValues.dateRange) {
      updatedQueryParams.endDate = filtersFormValues.dateRange.endDate;
      updatedQueryParams.startDate = filtersFormValues.dateRange.startDate;
      isResetPage = true;
    } else {
      updatedQueryParams.startDate = null;
      updatedQueryParams.endDate = null;
    }
    if (filtersFormValues.grade) {
      updatedQueryParams.grade = filtersFormValues.grade;
      updatedQueryParams.gradeRange = this.gradeRangeControl?.value;
      isResetPage = true;
    } else {
      updatedQueryParams.grade = null;
      updatedQueryParams.gradeRange = null;
    }
    if (filtersFormValues.id) {
      updatedQueryParams.id = filtersFormValues.id;
      isResetPage = true;
    } else updatedQueryParams.id = null;
    return {
      updatedQueryParams,
      isResetPage
    }
  }

  initQueryParamsSub(): void {
    this.route.queryParams.pipe(
      withLatestFrom(this.paginationData$),
      takeUntil(this.unsubscribe$)
    ).subscribe(([ queryParams, paginationData ]) => {
      if (!paginationData.isPaginated) {
        const isApplyFilters = this.isApplyFilters(queryParams);
        if (isApplyFilters) this.filterFn = this.createFilterFn(queryParams);
        else this.filterFn = undefined;
      } else {
        this.setPaginationData(paginationData.currentPage);
      }
    });
  }

  createFilterFn(queryParams: DataFiltersQueryParams): FilterFn {
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

    return (item: DataTableItem): boolean => {
      let idMatch = true;
      let gradeMatch = true;
      let dateMatch = true;

      if (isFilterById) idMatch = item.id === queryParams.id;
      if (isFilterByGrade) gradeMatch = this.compareAccordingToOperator(item.grade as number, queryParams.gradeRange, gradeQueryParam);
      if (isFilterByDate) {
        const itemDate = new Date(item.gradeDate);
        dateMatch = startDate <= itemDate && itemDate <= endDate;
      }

      return idMatch && gradeMatch && dateMatch;
    };
  }

  setPaginationData(currentPage: number): void {
    const paginationData = this.paginationDataService.calculatePaginationData(currentPage);
    this.paginationDataService.setPaginationData(paginationData);
  }

  isApplyFilters(queryParams: DataFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === DataFiltersEnum.id || filter === DataFiltersEnum.grade || filter === DataFiltersEnum.startDate || filter === DataFiltersEnum.endDate) return true;
    }
    return false;
  }

  setGrandeRangeIsDisabled(grade: number | null | undefined): void {
    if (typeof grade === "number") this.gradeRangeControl?.enable({ emitEvent: false });
    else this.gradeRangeControl?.disable({ emitEvent: false });
  }

  compareAccordingToOperator(grade: number, gradeRange: string | null | undefined, queryParamsGrade: number): boolean {
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
