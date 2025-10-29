import {
  ChangeDetectionStrategy,
  Component, computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  untracked
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { PaginationDataService } from '../../../../shared/services/pagination-data/pagination-data.service';
import { MonitorFilterService } from '../../services/monitor-filter.service';
import { traineesFeature } from '../../../data/store/trainees.reducer';
import { monitorTableConfig } from '../../data/monitor-table-config';
import { FilterFn } from '../../../../shared/types/data-table/filter-fn-type';
import { Trainee } from '../../../data/interfaces/trainee-interface';
import {
  MonitorsFiltersQueryParams,
  MonitorsFiltersFormPatchValues
} from '../../interfaces/monitors-filters-query-params.interface';
import { IsPassedIsFailedQueryParamEnum } from '../../enums/is-passed-is-failed-query-param-enum';
import { Button } from '../../../../shared/components/buttons/button/button';
import { DataTable } from '../../../../shared/components/tables/data-table/data-table';
import { SelectInput } from '../../../../shared/components/inputs/select-input/select-input';
import { TextInput } from '../../../../shared/components/inputs/text-input/text-input';
import { CheckboxInput } from '../../../../shared/components/inputs/checkbox-input/checkbox-input';
import { DEBOUNCE_TIME_MS } from '../../../../shared/const/app.constants';

@Component({
  selector: 'app-monitor',
  imports: [
    Button,
    DataTable,
    SelectInput,
    TextInput,
    ReactiveFormsModule,
    CheckboxInput
  ],
  providers: [ PaginationDataService ],
  templateUrl: './monitor.html',
  styleUrl: './monitor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Monitor implements OnInit {
  store = inject(Store);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  paginationDataService = inject(PaginationDataService);
  monitorFilterService = inject(MonitorFilterService);
  destroyRef = inject(DestroyRef);

  traineesStateIds = this.store.selectSignal(traineesFeature.selectTraineesIds);
  trainees = this.store.selectSignal(traineesFeature.selectTrainees);
  isLoading = this.store.selectSignal(traineesFeature.selectIsLoading);
  tableConfig = signal(monitorTableConfig);
  filterFn = signal<FilterFn<Trainee> | undefined>(undefined);
  queryParams = toSignal(this.route.queryParams, { initialValue: {} as Params });
  isResetPage = signal(false);
  filteredTrainees = computed(() => {
    const trainees = this.trainees();
    const filterFn = this.filterFn();

    let items = [ ...trainees ];
    if (filterFn) items = items.filter(filterFn);

    return items;
  });

  constructor() {
    this.setupPaginationEffect();
    this.setupFilterEffect();
  }

  private setupPaginationEffect(): void {
    effect(() => {
      const items = this.filteredTrainees();
      const params = this.queryParams();
      const currentPage = params['page'] ? +params['page'] : 1;

      untracked(() => {
        const paginationData = this.paginationDataService.calculatePaginationData(currentPage, items.length);
        this.paginationDataService.setPaginationData(paginationData);
      });
    });
  }

  private setupFilterEffect(): void {
    effect(() => {
      const params = this.queryParams();

      untracked(() => {
        const paginationData = this.paginationDataService.paginationData();
        if (!paginationData.isPaginated) {
          const shouldApplyFilters = this.monitorFilterService.isApplyFilters(params);
          if (shouldApplyFilters) this.filterFn.set(this.monitorFilterService.createFilterFn(params));
          else this.filterFn.set(undefined);
        }
      });
    });
  }

  monitorFiltersForm = this.fb.group({
    ids: new FormControl<string | string[]>([]),
    name: new FormControl<string>(''),
    isPassed: new FormControl<boolean | null>(true),
    isFailed: new FormControl<boolean | null>(true),
  });

  ngOnInit(): void {
    this.patchFiltersFormValue();
    this.initFiltersFormSub();
  }

  patchFiltersFormValue(): void {
    const queryParams = this.route.snapshot.queryParams as Partial<MonitorsFiltersQueryParams>;
    const formValues: Partial<MonitorsFiltersFormPatchValues> = {};

    if (queryParams.ids) {
      formValues.ids = typeof queryParams.ids === 'string' ? queryParams.ids.split(',') : queryParams.ids;
    }

    if (queryParams.name) {
      formValues.name = queryParams.name;
    }

    if (queryParams.isPassed !== undefined) {
      formValues.isPassed = queryParams.isPassed === IsPassedIsFailedQueryParamEnum.true;
    }

    if (queryParams.isFailed !== undefined) {
      formValues.isFailed = queryParams.isFailed === IsPassedIsFailedQueryParamEnum.true;
    }

    this.monitorFiltersForm.patchValue(formValues);
  }

  initFiltersFormSub(): void {
    this.monitorFiltersForm.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME_MS),
        distinctUntilChanged(),
        map(formValues => this.formatSearchFormToQueryParams(formValues)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(formatedQueryParams => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...formatedQueryParams, page: this.isResetPage() ? 1 : this.route.snapshot.queryParams['page'] },
        queryParamsHandling: 'merge',
      });
      if (!this.isResetPage()) this.isResetPage.set(true);
    })
  }

  formatSearchFormToQueryParams(formValues: Partial<MonitorsFiltersFormPatchValues>): MonitorsFiltersQueryParams {
    const formattedParams: MonitorsFiltersQueryParams = {};

    if (formValues.ids !== null && formValues.ids !== undefined && formValues.ids !== '') {
      formattedParams.ids = Array.isArray(formValues.ids)
        ? (formValues.ids.length ? formValues.ids.toString() : null)
        : formValues.ids;
    } else {
      formattedParams.ids = null;
    }

    if (formValues.name !== null && formValues.name !== undefined && formValues.name !== '') {
      formattedParams.name = formValues.name;
    } else {
      formattedParams.name = null;
    }

    if (formValues.isPassed !== null && formValues.isPassed !== undefined) {
      formattedParams.isPassed = formValues.isPassed;
    } else {
      formattedParams.isPassed = null;
    }

    if (formValues.isFailed !== null && formValues.isFailed !== undefined) {
      formattedParams.isFailed = formValues.isFailed;
    } else {
      formattedParams.isFailed = null;
    }

    return formattedParams;
  }

  clearFilters(): void {
    this.monitorFiltersForm.reset();
    this.monitorFiltersForm.controls.isPassed.setValue(true);
    this.monitorFiltersForm.controls.isFailed.setValue(true);
  }
}
