import { ChangeDetectionStrategy, Component, computed, effect, input, signal, viewChild } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from "chart.js";
import DataLabelsPlugin from "chartjs-plugin-datalabels";

import { ChartDataInterface } from '../../../interfaces/components/charts/chart-data-interface';

Chart.register(...registerables);

@Component({
  selector: "app-chart",
  templateUrl: "./chart.html",
  styleUrl: "./chart.scss",
  imports: [
    BaseChartDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComp {
  chart = viewChild<BaseChartDirective>(BaseChartDirective);

  data = input.required<ChartDataInterface>();
  graphLabel = input.required<string>();

  private readonly Y_AXIS_MIN = 0;
  private readonly Y_AXIS_MAX = 110;

  private _colorPalette?: Array<{ backgroundColor: string; borderColor: string }>;

  private get colorPalette() {
    if (!this._colorPalette) {
      const styles = getComputedStyle(document.documentElement);
      this._colorPalette = [
        {
          backgroundColor: styles.getPropertyValue('--chart-color-1-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-1-border').trim()
        },
        {
          backgroundColor: styles.getPropertyValue('--chart-color-2-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-2-border').trim()
        },
        {
          backgroundColor: styles.getPropertyValue('--chart-color-3-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-3-border').trim()
        },
        {
          backgroundColor: styles.getPropertyValue('--chart-color-4-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-4-border').trim()
        },
        {
          backgroundColor: styles.getPropertyValue('--chart-color-5-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-5-border').trim()
        },
        {
          backgroundColor: styles.getPropertyValue('--chart-color-6-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-6-border').trim()
        },
        {
          backgroundColor: styles.getPropertyValue('--chart-color-7-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-7-border').trim()
        },
        {
          backgroundColor: styles.getPropertyValue('--chart-color-8-bg').trim(),
          borderColor: styles.getPropertyValue('--chart-color-8-border').trim()
        },
      ];
    }
    return this._colorPalette;
  }

  readonly barChartOptions: ChartConfiguration["options"] = {
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {
        min: this.Y_AXIS_MIN,
        max: this.Y_AXIS_MAX,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };
  readonly barChartType: ChartType = "bar";
  readonly barChartPlugins = [ DataLabelsPlugin ];

  barChartData = computed<ChartData<"bar">>(() => {
    const currentData = this.data();
    const currentLabel = this.graphLabel();
    const dataValues = Object.values(currentData);

    const backgroundColors = dataValues.map((_, index) =>
      this.colorPalette[index % this.colorPalette.length].backgroundColor
    );

    const borderColors = dataValues.map((_, index) =>
      this.colorPalette[index % this.colorPalette.length].borderColor
    );

    return {
      labels: Object.keys(currentData),
      datasets: [ {
        data: dataValues,
        label: currentLabel,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      } ]
    };
  });

  private isUpdatedNeeded = signal(false);

  constructor() {
    effect(() => {
      this.barChartData();
      this.isUpdatedNeeded.set(true);
    });

    effect(() => {
      if (this.isUpdatedNeeded() && this.chart) {
        this.chart()?.update();
        this.isUpdatedNeeded.set(false);
      }
    });
  }
}
