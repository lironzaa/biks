import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';

import { ChartComp } from '../../../../shared/components/charts/chart/chart';
import { analysisFeature } from '../../store/analysis.reducer';
import { getChartTitle } from '../../const/chart-titles.const';

@Component({
  selector: 'app-chart-display',
  imports: [ ChartComp ],
  templateUrl: './chart-display.html',
  styleUrl: './chart-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDisplay {
  store = inject(Store);

  chartNumber = input.required<number>();

  traineesGradesAverages = this.store.selectSignal(analysisFeature.selectGradesAveragesForSelectedTrainees);
  subjectsGradesAverages = this.store.selectSignal(analysisFeature.selectGradesAveragesForSelectedSubjects);
  overallTraineesAverages = this.store.selectSignal(analysisFeature.selectOverallAveragesForSelectedTrainees);

  hasSubjectsData = computed(() => {
    const data = this.subjectsGradesAverages();
    return data && Object.keys(data).length > 0;
  });

  hasOverallTraineesData = computed(() => {
    const data = this.overallTraineesAverages();
    return data && Object.keys(data).length > 0;
  });

  chartTitle = computed(() => getChartTitle(this.chartNumber()));
}