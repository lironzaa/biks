import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from "chart.js";
import DataLabelsPlugin from "chartjs-plugin-datalabels";

Chart.register(...registerables);

import { ChartDataInterface } from "../../../interfaces/chart-data-interface";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrl: "./chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) data!: ChartDataInterface;
  @Input({ required: true }) graphLabel: string = "";

  public barChartOptions: ChartConfiguration["options"] = {
    scales: {
      x: {},
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };
  public barChartType: ChartType = "bar";
  public barChartPlugins = [ DataLabelsPlugin ];

  public barChartData: ChartData<"bar"> = {
    labels: [],
    datasets: [],
  };

  ngOnInit(): void {
    this.barChartData.labels = this.labels;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] && Object.keys(changes["data"].currentValue).length > 0) {
      this.barChartData.datasets = [];
      this.setData();
      this.chart?.update();
    } else {
      this.barChartData.datasets = [];
      this.chart?.update();
    }
  }

  setData(): void {
    for (const item in this.data) {
      this.barChartData.datasets.push({ data: [ this.data[item] ], label: item });
    }
  }
}
