import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit,
  Output
} from "@angular/core";
import { takeUntil } from "rxjs";

import { DataTableColumn, DataTableConfig, DataTableItem } from "../../../interfaces/data-table-interface";
import { PaginationDataService } from "../../../services/pagination-data.service";
import { Trainee, TraineeRow } from "../../../../features/data/interfaces/trainee-interface";
import { Unsubscribe } from "../../../class/unsubscribe.class";
import { PaginationData } from "../../../interfaces/pagination-data-interface";
import { FilterFn } from "../../../types/filter-fn-type";
import { SortDirectionEnum } from "../../../enums/sort-direction-enum";
import { SortTypeEnum } from "../../../enums/sort-type-enum";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T> extends Unsubscribe implements OnInit {
  paginationDataService = inject(PaginationDataService);

  dataTableConfig = input.required<DataTableConfig<T>>();
  items = input.required({
    transform: (items: TraineeRow[] | Trainee[]): DataTableItem[] => items as unknown as DataTableItem[]
  })
  isLoading = input.required<boolean>();
  filterFn: InputSignal<FilterFn | undefined> = input.required();
  isPointer = input(false);
  activeItemId: InputSignal<string | undefined> = input();
  idKey = input("id");
  @Output() tableRowClicked = new EventEmitter<DataTableItem>();
  @Output() sortItemsClicked = new EventEmitter<DataTableItem[]>();

  paginationData!: PaginationData;
  sortDirectionEnum = SortDirectionEnum;

  ngOnInit(): void {
    this.paginationDataService.getPaginationDataListener().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(paginationData => this.paginationData = paginationData);
  }

  onTableRowClick(item: DataTableItem): void {
    this.tableRowClicked.emit(item);
  }

  onSortItems(dataTableColumn: DataTableColumn<T>) {
    if (!dataTableColumn.isSortable) return;

    this.resetActiveSortedColumn(dataTableColumn);
    this.adjustSortDirection(dataTableColumn);
    const sortedRows: DataTableItem[] = this.sortItems(dataTableColumn);

    this.sortItemsClicked.emit(sortedRows);
  }

  adjustSortDirection(dataTableColumn: DataTableColumn<T>): void {
    if (dataTableColumn.sortDirection === SortDirectionEnum.none) {
      dataTableColumn.sortDirection = SortDirectionEnum.desc;
    } else if (dataTableColumn.sortDirection === SortDirectionEnum.desc) {
      dataTableColumn.sortDirection = SortDirectionEnum.asc;
    } else if (dataTableColumn.sortDirection === SortDirectionEnum.asc) {
      dataTableColumn.sortDirection = SortDirectionEnum.desc;
    }
  }

  sortItems(dataTableColumn: DataTableColumn<T>): DataTableItem[] {
    const sortMultiplier = dataTableColumn.sortDirection === SortDirectionEnum.asc ? 1 : -1;

    switch (dataTableColumn.sortType) {
      case SortTypeEnum.string: {
        return this.items().slice().sort((itemA, itemB) => {
          const a = itemA[dataTableColumn.dataProperty] as string;
          const b = itemB[dataTableColumn.dataProperty] as string;
          return b.localeCompare(a) * sortMultiplier;
        });
      }
      case SortTypeEnum.integer: {
        return this.items().slice().sort((itemA, itemB) => {
          const a = itemA[dataTableColumn.dataProperty] as number;
          const b = itemB[dataTableColumn.dataProperty] as number;
          return (a - b) * sortMultiplier;
        });
      }
      default : {
        throw new Error("Unknown sort type");
      }
    }
  }

  resetActiveSortedColumn(dataTableColumn: DataTableColumn<T>): void {
    const activeSortedTableColumn = this.dataTableConfig().columns.find(column => column.isSortable && column.sortDirection !== SortDirectionEnum.none && column.dataProperty !== dataTableColumn.dataProperty)
    if (activeSortedTableColumn) activeSortedTableColumn.sortDirection = SortDirectionEnum.none;
  }
}
