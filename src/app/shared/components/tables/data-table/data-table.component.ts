import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
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
export class DataTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dataTableConfig!: DataTableConfig;
  @Input({ transform: (items: Trainee[]): DataTableItem[] => items as unknown as DataTableItem[], required: true }) items: DataTableItem[] = [];
  @Input({ transform: (items: Trainee[]): DataTableItem[] => items as unknown as DataTableItem[], required: true }) itemsOrigin: DataTableItem[] = [];
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) filtersForm!: FormGroup;

  paginationData!: PaginationData;
  paginationDataSub!: Subscription;
  queryParamsSub!: Subscription;

  constructor(private paginationDataService: PaginationDataService, private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.initPaginationDataSub();
    this.initQueryParamsSub();
  }

  initPaginationDataSub(): void {
    console.log(this.items);
    this.paginationDataSub = this.paginationDataService.getPaginationDataListener()
      .subscribe(paginationData => {
        this.paginationData = paginationData;
        // console.log(this.paginationData);
      });
  }

  initQueryParamsSub(): void {
    this.queryParamsSub = this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.applyFilters(params as DataFiltersInterface);
    });
  }

  applyFilters(params: DataFiltersInterface): void {
    console.log(this.itemsOrigin);
    const filteredItems= this.itemsOrigin.filter(item => {
      const idMatch = !params.id || item["id"] === Number(params.id);
      // const categoryMatch = !categoryFilter || item.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return idMatch;
      // return idMatch && categoryMatch;
    })
    console.log(this.items);
    this.store.dispatch(filterTrainees({ trainees: filteredItems as unknown as Trainee[] }));
  }

  trackByItemId(index: number, item: any): any {
    return item.id;
  }

  trackByItemDataProperty(index: number, item: DataTableColumn): string {
    return item.dataProperty;
  }

  ngOnDestroy(): void {
    if (!this.paginationDataSub.closed) this.paginationDataSub.unsubscribe();
  }
}
