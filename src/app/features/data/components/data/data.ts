import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  untracked
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { DEBOUNCE_TIME_MS } from '../../../../shared/const/app.constants';
import { traineesFeature } from '../../store/trainees.reducer';
import { DataTable } from '../../../../shared/components/tables/data-table/data-table';
import { dataTableConfig } from '../../data/data-table-config';
import { FilterFn } from '../../../../shared/types/data-table/filter-fn-type';
import { TraineeRow } from '../../interfaces/trainee-interface';
import { PaginationDataService } from '../../../../shared/services/pagination-data/pagination-data.service';
import { DataFilterService } from '../../services/data-filter.service';
import { GradeRangeEnum } from '../../enums/grade-range-enum';
import {
  DataFiltersFormPatchValues,
  DataFiltersQueryParams
} from '../../interfaces/data-filters-query-params.interface';
import { DataFiltersFormValues, FiltersFormState } from '../../interfaces/data-filters-form-values';
import { GradeRangeType } from '../../types/grade-range-type';
import { setSelectedTraineeRow } from '../../store/trainees.actions';
import { SubjectTypeOptions } from '../../data/subject-type-options';
import { SubjectType } from '../../types/subject-type';
import { TextInput } from '../../../../shared/components/inputs/text-input/text-input';
import { SelectInput } from '../../../../shared/components/inputs/select-input/select-input';
import { RangeDateInput } from '../../../../shared/components/inputs/range-date-input/range-date-input';
import { Button } from '../../../../shared/components/buttons/button/button';
import { NumberInput } from '../../../../shared/components/inputs/number-input/number-input';

@Component({
  selector: 'app-data',
  imports: [
    DataTable,
    TextInput,
    SelectInput,
    RangeDateInput,
    Button,
    ReactiveFormsModule,
    NumberInput
  ],
  providers: [ PaginationDataService ],
  templateUrl: './data.html',
  styleUrl: './data.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Data implements OnInit {
  store = inject(Store);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  paginationDataService = inject(PaginationDataService);
  dataFilterService = inject(DataFilterService);
  destroyRef = inject(DestroyRef);

  traineesRows = this.store.selectSignal(traineesFeature.selectTraineesRows);
  isLoading = this.store.selectSignal(traineesFeature.selectIsLoading);
  selectedTraineesRow = this.store.selectSignal(traineesFeature.selectSelectedTraineesRow);
  filterFn = signal<FilterFn<TraineeRow> | undefined>(undefined);
  tableConfig = signal(dataTableConfig);
  queryParams = toSignal(this.route.queryParams, { initialValue: {} as Params });
  subjectTypeOptions = signal(SubjectTypeOptions);
  isClearing = signal(false);
  filterTypeOptions = signal([
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'grade', label: 'Grade' },
    { id: 'dateRange', label: 'Date Range' },
    { id: 'subject', label: 'Subject' }
  ]);
  gradeRangeOptions = signal([
    { id: GradeRangeEnum.equals, label: 'Equals' },
    { id: GradeRangeEnum.greaterThan, label: 'Greater Than' },
    { id: GradeRangeEnum.lessThan, label: 'Less Than' }
  ]);
  filteredTrainees = computed(() => {
    const traineesRows = this.traineesRows();
    const filterFn = this.filterFn();

    let items = [ ...traineesRows ];
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
          const shouldApplyFilters = this.dataFilterService.isApplyFilters(params);
          if (shouldApplyFilters) this.filterFn.set(this.dataFilterService.createFilterFn(params));
          else this.filterFn.set(undefined);
        }
      });
    });
  }

  private readonly DEFAULT_FORM_VALUES = {
    id: '',
    name: '',
    grade: null,
    subject: null,
    gradeRange: GradeRangeEnum.equals,
    dateRange: {
      startDate: null,
      endDate: null
    }
  } as const;

  filterTypeControl = new FormControl<string | null>(null);

  dataFiltersForm = this.fb.group({
    id: new FormControl<string | null>(''),
    name: new FormControl<string | null>(''),
    grade: new FormControl<number | null>(null),
    subject: new FormControl<SubjectType | null>(null),
    gradeRange: new FormControl<GradeRangeType | null>({
      value: GradeRangeEnum.equals,
      disabled: !this.route.snapshot.queryParams['grade']
    }),
    dateRange: this.fb.group({
      startDate: new FormControl<string | Date | null>(null),
      endDate: new FormControl<string | Date | null>(null),
    })
  });
  gradeRangeControl = this.dataFiltersForm.controls.gradeRange;

  ngOnInit(): void {
    this.patchFiltersFormValue();
    this.initFiltersFormSub();
    this.initFilterTypeControlSub();
  }

  patchFiltersFormValue(): void {
    const dataFiltersQueryParams: DataFiltersQueryParams = { ...this.route.snapshot.queryParams };
    const dataFiltersQueryParamsPatchValues: DataFiltersFormPatchValues = {
      ...(dataFiltersQueryParams.page && { page: dataFiltersQueryParams.page }),
      ...(dataFiltersQueryParams.id && { id: dataFiltersQueryParams.id }),
      ...(dataFiltersQueryParams.name && { name: dataFiltersQueryParams.name }),
      ...(dataFiltersQueryParams.grade && { grade: Number(dataFiltersQueryParams.grade) }),
      ...(dataFiltersQueryParams.gradeRange && { gradeRange: dataFiltersQueryParams.gradeRange }),
      ...(dataFiltersQueryParams.subject && { subject: dataFiltersQueryParams.subject }),
      ...(dataFiltersQueryParams.startDate && dataFiltersQueryParams.endDate && {
        dateRange: {
          startDate: new Date(dataFiltersQueryParams.startDate),
          endDate: new Date(dataFiltersQueryParams.endDate),
        }
      }),
    }
    this.dataFiltersForm.patchValue(dataFiltersQueryParamsPatchValues, { emitEvent: false });

    if (dataFiltersQueryParams.id) {
      this.filterTypeControl.setValue('id', { emitEvent: false });
    } else if (dataFiltersQueryParams.name) {
      this.filterTypeControl.setValue('name', { emitEvent: false });
    } else if (dataFiltersQueryParams.grade) {
      this.filterTypeControl.setValue('grade', { emitEvent: false });
    } else if (dataFiltersQueryParams.startDate || dataFiltersQueryParams.endDate) {
      this.filterTypeControl.setValue('dateRange', { emitEvent: false });
    } else if (dataFiltersQueryParams.subject) {
      this.filterTypeControl.setValue('subject', { emitEvent: false });
    }
  }

  initFiltersFormSub(): void {
    this.dataFiltersForm.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(filtersFormValues => {
      if (this.isClearing()) {
        this.isClearing.set(false);
        return;
      }

      const filtersFormState: FiltersFormState = this.generateFormState(filtersFormValues);
      this.setGradeRangeIsDisabled(filtersFormState.updatedQueryParams.grade);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          ...filtersFormState.updatedQueryParams,
          page: filtersFormState.isResetPage ? 1 : this.route.snapshot.queryParams['page']
        },
        queryParamsHandling: 'merge',
      });
    })
  }

  initFilterTypeControlSub(): void {
    this.filterTypeControl.valueChanges
      .pipe(
        skip(1),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => this.resetFiltersAndQueryParams());
  }

  private resetFiltersAndQueryParams(): void {
    this.dataFiltersForm.reset(this.DEFAULT_FORM_VALUES, { emitEvent: false });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        id: null,
        name: null,
        grade: null,
        gradeRange: null,
        subject: null,
        startDate: null,
        endDate: null,
        page: 1
      },
      queryParamsHandling: 'merge',
    });
  }

  setGradeRangeIsDisabled(grade: number | null | undefined): void {
    if (typeof grade === 'number') this.gradeRangeControl?.enable({ emitEvent: false });
    else this.gradeRangeControl?.disable({ emitEvent: false });
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
    if (filtersFormValues.name) {
      updatedQueryParams.name = filtersFormValues.name;
      isResetPage = true;
    } else updatedQueryParams.name = null;
    if (filtersFormValues.subject) {
      updatedQueryParams.subject = filtersFormValues.subject;
      isResetPage = true;
    } else updatedQueryParams.subject = null;
    return {
      updatedQueryParams,
      isResetPage
    }
  }

  clearFilters(): void {
    this.isClearing.set(true);
    this.filterTypeControl.setValue(null, { emitEvent: false });
    this.dataFiltersForm.reset(this.DEFAULT_FORM_VALUES);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: '',
    });
  }

  onTableRowClick(traineeRow: TraineeRow) {
    this.store.dispatch(setSelectedTraineeRow({ traineeRow }));
  }
}
