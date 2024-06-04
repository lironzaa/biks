import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { debounceTime, distinctUntilChanged, Observable, takeUntil, withLatestFrom } from "rxjs";

import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { PaginationDataService } from "../../../../shared/services/pagination-data.service";
import { traineesFeature, TraineesState } from "../../../data/store/trainees.reducer";
import { monitorTableConfig } from "../../data/monitor-table-config";
import { MonitorsFiltersQueryParams } from "../../interfaces/monitors-filters-query-params.interface";
import { DataTableFiltersValues, DataTableItem } from "../../../../shared/interfaces/data-table-interface";
import { Trainee } from "../../../data/interfaces/trainee-interface";
import { MonitorFiltersEnum } from "../../enums/monitor-filters-enum";
import { IsPassedIsFailedQueryParamEnum } from "../../enums/is-passed-is-failed-query-param-enum";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";
import { FilterFn } from "../../../../shared/types/filter-fn-type";
import { sortTrainees } from "../../../data/store/trainees.actions";

@Component({
  selector: "app-monitor",
  templateUrl: "./monitor.component.html",
  styleUrl: "./monitor.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorComponent extends Unsubscribe implements OnInit {
  formUtilitiesService = inject(FormUtilitiesService);
  store = inject(Store);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  paginationDataService = inject(PaginationDataService);
  private cdRef = inject(ChangeDetectorRef);

  traineesState$ = new Observable<TraineesState>();
  traineesStateIds$ = new Observable<string[]>();
  monitorTableConfig = monitorTableConfig;
  isResetPage = false;
  filterFn: FilterFn | undefined;
  paginationData$ = this.paginationDataService.getPaginationDataListener();

  monitorFiltersForm = this.fb.group({
    "ids": new FormControl<string | string[]>(""),
    "name": new FormControl<string>(""),
    "isPassed": new FormControl<boolean | string>(true),
    "isFailed": new FormControl<boolean | string>(true),
  });

  ngOnInit(): void {
    this.initStoreSelects();
    this.patchFiltersFormValue();
    this.initQueryParamsSub();
    this.initFiltersFormSub();
  }

  initStoreSelects(): void {
    this.traineesStateIds$ = this.store.select(traineesFeature.selectTraineesIds);
    this.traineesState$ = this.store.select(traineesFeature.selectTraineesState);
  }

  patchFiltersFormValue(): void {
    const queryParamsValue: MonitorsFiltersQueryParams = { ...this.route.snapshot.queryParams };
    if (queryParamsValue.ids && typeof queryParamsValue.ids === "string") queryParamsValue.ids = queryParamsValue.ids.split(",");
    if (queryParamsValue.isPassed && queryParamsValue.isPassed === IsPassedIsFailedQueryParamEnum.false) queryParamsValue.isPassed = false;
    if (queryParamsValue.isFailed && queryParamsValue.isFailed === IsPassedIsFailedQueryParamEnum.false) queryParamsValue.isFailed = false;
    this.monitorFiltersForm.patchValue(queryParamsValue);
  }

  initFiltersFormSub(): void {
    this.monitorFiltersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map(formValues => this.formatSearchFormToQueryParams(formValues)),
        takeUntil(this.unsubscribe$)
      ).subscribe(formatedQueryParams => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...formatedQueryParams, page: this.isResetPage ? 1 : this.route.snapshot.queryParams.page },
        queryParamsHandling: "merge",
      });
      if (!this.isResetPage) this.isResetPage = true;
    })
  }

  formatSearchFormToQueryParams(formValues: DataTableFiltersValues): DataTableFiltersValues {
    for (const value in formValues) {
      if (formValues[value] === "") formValues[value] = null;
      else if (Array.isArray(formValues[value])) {
        formValues[value] = (formValues[value] as []).length ? formValues[value]?.toString() : null;
      }
    }
    return formValues;
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
      this.cdRef.markForCheck();
    });
  }

  isApplyFilters(queryParams: MonitorsFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === MonitorFiltersEnum.ids || filter === MonitorFiltersEnum.name || filter === MonitorFiltersEnum.isPassed || filter === MonitorFiltersEnum.isFailed) return true;
    }
    return false;
  }

  createFilterFn(queryParams: MonitorsFiltersQueryParams): FilterFn {
    let lowerNameQueryParam: string;
    const isFilterByName = queryParams.name !== undefined;
    if (isFilterByName) lowerNameQueryParam = queryParams.name!.toLowerCase();

    let idsArrayQueryParam: string[];
    const isFilterByIds = queryParams.ids !== undefined;
    if (isFilterByIds && typeof queryParams.ids === "string") idsArrayQueryParam = queryParams.ids.split(",");

    const isFilterIsPassed = queryParams.isPassed !== undefined && queryParams.isPassed === IsPassedIsFailedQueryParamEnum.false;
    const isFilterIsFailed = queryParams.isFailed !== undefined && queryParams.isFailed === IsPassedIsFailedQueryParamEnum.false;

    return (item: DataTableItem): boolean => {
      let nameMatch = true;
      let idMatch = true;
      let isPassedMatch = true;
      let isFailedMatch = true;

      if (isFilterByIds) idMatch = idsArrayQueryParam.includes(item.id as string);
      if (isFilterByName) {
        const itemNameLower = (item.name as string).toLowerCase();
        nameMatch = itemNameLower.includes(lowerNameQueryParam);
      }
      if (isFilterIsPassed && (item.average as number) > 65) isPassedMatch = false;
      if (isFilterIsFailed && (item.average as number) < 65) isFailedMatch = false;

      return nameMatch && idMatch && isPassedMatch && isFailedMatch;
    }
  }

  setPaginationData(currentPage: number): void {
    const paginationData = this.paginationDataService.calculatePaginationData(currentPage);
    this.paginationDataService.setPaginationData(paginationData);
  }

  resetFilters(): void {
    this.monitorFiltersForm.reset();
    this.monitorFiltersForm.get("isPassed")?.setValue(true);
    this.monitorFiltersForm.get("isFailed")?.setValue(true);
  }

  onSortItemsClicked(sortedItems: DataTableItem[]): void {
    this.store.dispatch(sortTrainees({ trainees: sortedItems as unknown as Trainee[] }));
  }
}
