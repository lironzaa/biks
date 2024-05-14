import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { debounceTime, distinctUntilChanged, Observable, takeUntil } from "rxjs";

import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { PaginationDataService } from "../../../../shared/services/pagination-data.service";
import {
  selectTraineesState,
  selectTraineesIds,
  selectTraineesOrigin
} from "../../../data/store/trainees.selectors";
import { filterTrainees } from "../../../data/store/trainees.actions";
import * as fromApp from "../../../../core/store/app.reducer";
import { TraineesState } from "../../../data/store/trainees.reducer";
import { monitorTableConfig } from "../../data/monitor-table-config";
import { MonitorStateOptions } from "../../data/monitor-state-options";
import { Trainee } from "../../../data/interfaces/trainee-interface";
import { MonitorsFiltersQueryParams } from "../../interfaces/monitors-filters-query-params.interface";
import { DataTableFiltersValues } from "../../../../shared/interfaces/data-table-interface";
import { MonitorFiltersEnum } from "../../enums/monitor-filters-enum";
import { IsPassedIsFailedQueryParamEnum } from "../../enums/is-passed-is-failed-query-param-enum";
import { Unsubscribe } from "../../../../shared/class/unsubscribe.class";

@Component({
  selector: "app-monitor",
  templateUrl: "./monitor.component.html",
  styleUrl: "./monitor.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorComponent extends Unsubscribe implements OnInit {
  traineesState$: Observable<TraineesState>;
  traineesOrigin!: Trainee[];
  traineesStateIds$: Observable<string[]>;
  monitorTableConfig = monitorTableConfig;
  isInitialRender = true;
  isResetPage = false;
  monitorStateOptions = MonitorStateOptions;

  monitorFiltersForm = this.fb.group({
    "ids": new FormControl<string | string[]>(""),
    "name": new FormControl<string>(""),
    "isPassed": new FormControl<boolean | string>(true),
    "isFailed": new FormControl<boolean | string>(true),
  });

  constructor(protected formUtilitiesService: FormUtilitiesService, private fb: FormBuilder,
              private store: Store<fromApp.AppState>, private route: ActivatedRoute,
              private paginationDataService: PaginationDataService, private router: Router) {
    super();
    this.traineesStateIds$ = store.select(selectTraineesIds);
    this.traineesState$ = store.select(selectTraineesState);
  }

  ngOnInit(): void {
    this.store.select(selectTraineesOrigin).pipe(takeUntil(this.unsubscribe$))
      .subscribe(traineesOrigin => this.traineesOrigin = traineesOrigin);
    this.patchFiltersFormValue();
    this.initQueryParamsSub();
    this.initFiltersFormSub();
  }

  patchFiltersFormValue(): void {
    const queryParamsValue: MonitorsFiltersQueryParams = { ...this.route.snapshot.queryParams };
    if (queryParamsValue.ids) queryParamsValue.ids = (queryParamsValue.ids as string).split(",");
    if (queryParamsValue.isPassed && queryParamsValue.isPassed === IsPassedIsFailedQueryParamEnum.false) queryParamsValue.isPassed = false;
    if (queryParamsValue.isFailed && queryParamsValue.isFailed === IsPassedIsFailedQueryParamEnum.false) queryParamsValue.isFailed = false;
    this.monitorFiltersForm.patchValue(queryParamsValue);
  }

  initQueryParamsSub(): void {
    this.route.queryParams.subscribe((queryParams) => {
      const isApplyFilters = this.isApplyFilters(queryParams);
      if (isApplyFilters) {
        this.applyFilters(queryParams);
      } else {
        const paginationData = this.paginationDataService.calculatePaginationData(this.route.snapshot.queryParams.page ? +this.route.snapshot.queryParams.page : 1, this.traineesOrigin.length);
        this.paginationDataService.setPaginationData(paginationData);
      }
    });
  }

  isApplyFilters(queryParams: MonitorsFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === MonitorFiltersEnum.ids || filter === MonitorFiltersEnum.name || filter === MonitorFiltersEnum.isPassed || filter === MonitorFiltersEnum.isFailed) {
        return true;
      }
    }
    if (this.isResetPage) {
      const paginationData = this.paginationDataService.calculatePaginationData(1, this.traineesOrigin.length);
      this.paginationDataService.setPaginationData(paginationData);
      this.isResetPage = false;
    }
    this.store.dispatch(filterTrainees({ trainees: this.traineesOrigin }));
    return false;
  }

  applyFilters(queryParams: MonitorsFiltersQueryParams): void {
    let lowerNameQueryParam: string;
    const isFilterByName = queryParams.name !== undefined;
    if (isFilterByName) lowerNameQueryParam = queryParams.name!.toLowerCase();

    let idsArrayQueryParam: string[];
    const isFilterByIds = queryParams.ids !== undefined;
    if (isFilterByIds) idsArrayQueryParam = (queryParams.ids as string).split(",");

    const isFilterByIsPassed = queryParams.isPassed !== undefined && queryParams.isPassed === IsPassedIsFailedQueryParamEnum.false;
    const isFilterByIsFailed = queryParams.isFailed !== undefined && queryParams.isFailed === IsPassedIsFailedQueryParamEnum.false;

    const filteredItems = this.traineesOrigin.filter(item => {
      let nameMatch = true;
      let idMatch = true;
      let isPassedMatch = true;
      let isFailedMatch = true;

      if (isFilterByIds) idMatch = idsArrayQueryParam.includes(item.id);

      if (isFilterByName) {
        const itemNameLower = item.name.toLowerCase();
        nameMatch = itemNameLower.includes(lowerNameQueryParam);
      }

      if (isFilterByIsPassed && item.average > 64) isPassedMatch = false;

      if (isFilterByIsFailed && item.average < 66) isFailedMatch = false;

      return nameMatch && idMatch && isPassedMatch && isFailedMatch;
    })
    if (queryParams.page === "1") {
      const paginationData = this.paginationDataService.calculatePaginationData(1, filteredItems.length);
      this.paginationDataService.setPaginationData(paginationData);
    }
    this.store.dispatch(filterTrainees({ trainees: filteredItems }));
  }

  initFiltersFormSub(): void {
    this.monitorFiltersForm.valueChanges
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
      if (Array.isArray(formValues[value])) {
        formValues[value] = formValues[value]?.toString();
      }
      if (formValues[value] === "") {
        formValues[value] = null;
      } else {
        isResetPage = true;
      }
    }
    return { formValues, isResetPage };
  }

  resetFilters(): void {
    this.monitorFiltersForm.reset();
    this.monitorFiltersForm.get("isPassed")?.setValue(true);
    this.monitorFiltersForm.get("isFailed")?.setValue(true);
  }
}
