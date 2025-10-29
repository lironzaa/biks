import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

import { SubjectTypeOptions } from '../../../data/data/subject-type-options';
import { SubjectType } from '../../../data/types/subject-type';
import { traineesFeature } from '../../../data/store/trainees.reducer';
import { setSelectedSubjects, setSelectedTraineesIds } from '../../store/analysis.actions';
import { SelectInput } from '../../../../shared/components/inputs/select-input/select-input';
import { ChartDisplay } from '../chart-display/chart-display';
import { AnalysisFiltersQueryParams } from '../../interfaces/analysis-filters-query-params.interface';
import { DEBOUNCE_TIME_MS } from '../../../../shared/const/app.constants';
import { ALL_CHART_NUMBERS, getChartTitle } from '../../const/chart-titles.const';

@Component({
  selector: 'app-analysis',
  imports: [ ReactiveFormsModule, SelectInput, ChartDisplay, CdkDrag, CdkDropList ],
  templateUrl: './analysis.html',
  styleUrl: './analysis.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analysis implements OnInit, OnDestroy {
  store = inject(Store);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  subjectTypeOptions = signal(SubjectTypeOptions);
  traineesStateIds = this.store.selectSignal(traineesFeature.selectTraineesIds);

  visibleCharts = signal<{ left: number; right: number }>({ left: 1, right: 3 });

  hiddenChart = computed(() => {
    const visible = this.visibleCharts();
    return ALL_CHART_NUMBERS.find(chart => chart !== visible.left && chart !== visible.right) ?? ALL_CHART_NUMBERS[0];
  });

  hiddenChartTitle = computed(() => getChartTitle(this.hiddenChart()));

  dropOnLeft(event: CdkDragDrop<number>): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const draggedChart = event.item.data;
    const visible = this.visibleCharts();

    if (draggedChart !== visible.left) {
      this.visibleCharts.set({ left: draggedChart, right: visible.right });
    }
  }

  dropOnRight(event: CdkDragDrop<number>): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const draggedChart = event.item.data;
    const visible = this.visibleCharts();

    if (draggedChart !== visible.right) {
      this.visibleCharts.set({ left: visible.left, right: draggedChart });
    }
  }

  analysisForm = this.fb.group({
    ids: new FormControl<string[]>([]),
    subjects: new FormControl<SubjectType[]>([]),
  });

  ngOnInit(): void {
    this.patchFiltersFormValue();
    this.initValueChangesSubs();
  }

  patchFiltersFormValue(): void {
    const queryParams: AnalysisFiltersQueryParams = { ...this.route.snapshot.queryParams };

    if (queryParams.ids) {
      const idsArray = queryParams.ids.split(',').filter(id => id.trim());
      this.analysisForm.patchValue({ ids: idsArray }, { emitEvent: false });
      this.store.dispatch(setSelectedTraineesIds({ traineesIds: idsArray }));
    } else {
      this.store.dispatch(setSelectedTraineesIds({ traineesIds: [] }));
    }

    if (queryParams.subjects) {
      const subjectsArray = queryParams.subjects.split(',').filter(s => s.trim()) as SubjectType[];
      this.analysisForm.patchValue({ subjects: subjectsArray }, { emitEvent: false });
      this.store.dispatch(setSelectedSubjects({ selectedSubjects: subjectsArray }));
    } else {
      this.store.dispatch(setSelectedSubjects({ selectedSubjects: [] }));
    }
  }

  initValueChangesSubs(): void {
    this.analysisForm.controls.ids.valueChanges.pipe(
      debounceTime(DEBOUNCE_TIME_MS),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((selectedIds) => {
      const ids = selectedIds && selectedIds.length > 0 ? selectedIds.join(',') : null;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ids },
        queryParamsHandling: 'merge'
      });
      this.store.dispatch(setSelectedTraineesIds({ traineesIds: selectedIds ?? [] }));
    });

    this.analysisForm.controls.subjects.valueChanges.pipe(
      debounceTime(DEBOUNCE_TIME_MS),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((selectedSubjects) => {
      const subjects = selectedSubjects && selectedSubjects.length > 0 ? selectedSubjects.join(',') : null;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { subjects },
        queryParamsHandling: 'merge'
      });
      this.store.dispatch(setSelectedSubjects({ selectedSubjects: selectedSubjects ?? [] }));
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(setSelectedTraineesIds({ traineesIds: [] }));
    this.store.dispatch(setSelectedSubjects({ selectedSubjects: [] }));
  }
}
