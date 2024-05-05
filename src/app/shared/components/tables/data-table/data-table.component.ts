import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { DataTableColumn, DataTableConfig, DataTableItem } from "../../../interfaces/data-table-interface";
import { PaginationDataService } from "../../../services/pagination-data.service";
import { PaginationData } from "../../../interfaces/pagination-data-interface";
import { DataFiltersInterface } from "../../../../features/data/interfaces/data-filters.interface";
import * as fromApp from "../../../../core/store/app.reducer";
import { filterTrainees } from "../../../../features/data/store/trainees.actions";
import { Trainee } from "../../../../features/data/interfaces/trainee-interface";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {
  @Input({ required: true }) dataTableConfig!: DataTableConfig;
  @Input({
    transform: (items: Trainee[]): DataTableItem[] => items as unknown as DataTableItem[],
    required: true
  }) items: DataTableItem[] = [];
  @Input({
    transform: (items: Trainee[]): DataTableItem[] => items as unknown as DataTableItem[],
    required: true
  }) itemsOrigin: DataTableItem[] = [];
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) filtersForm!: FormGroup;

  queryParamsSub!: Subscription;

  paginationData$: Observable<PaginationData>;

  constructor(private paginationDataService: PaginationDataService, private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
    this.paginationData$ = this.paginationDataService.getPaginationDataListener();
  }

  ngOnInit(): void {
    this.initQueryParamsSub();
  }

  initQueryParamsSub(): void {
    this.queryParamsSub = this.route.queryParams.subscribe((params) => {
      // console.log(params);
      this.applyFilters(params as DataFiltersInterface);
    });
  }

  applyFilters(params: DataFiltersInterface): void {
    // console.log(this.itemsOrigin);
    const filteredItems = this.itemsOrigin.filter(item => {
      const idMatch = !params.id || item["id"] === Number(params.id);
      // const categoryMatch = !categoryFilter || item.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return idMatch;
      // return idMatch && categoryMatch;
    })
    this.store.dispatch(filterTrainees({ trainees: filteredItems as unknown as Trainee[] }));
  }

  trackByItemId(index: number, item: any): any {
    return item.id;
  }

  trackByItemDataProperty(index: number, item: DataTableColumn): string {
    return item.dataProperty;
  }
}
