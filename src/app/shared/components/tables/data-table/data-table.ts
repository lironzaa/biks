import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, SlicePipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { DataTableConfig } from '../../../interfaces/data-table/data-table-interface';
import { PaginationDataService } from '../../../services/pagination-data/pagination-data.service';
import { FilterFn } from '../../../types/data-table/filter-fn-type';
import { PaginationData } from '../../../interfaces/data-table/pagination-data-interface';
import { FilterSortItemsPipe } from '../../../pipes/filter-sort-items.pipe';
import { GetItemValuePipe } from '../../../pipes/get-item-value-pipe';
import { Pagination } from '../pagination/pagination';
import { TableFilters } from '../table-filters/table-filters';
import { ColumnTypeEnum } from '../../../enums/tables/column-type.enum';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableFilters,
    Pagination,
    SlicePipe,
    DatePipe,
    FilterSortItemsPipe,
    GetItemValuePipe,
    NgClass,
    MatTableModule,
  ]
})
export class DataTable<T> implements OnInit {
  paginationDataService = inject(PaginationDataService);
  destroyRef = inject(DestroyRef);

  config = input.required<DataTableConfig>();
  items = input.required<T[]>()
  isLoading = input.required<boolean>();
  filterFn = input.required<FilterFn<T> | undefined>();
  isPagination = input(true);
  activeItemId = input<string | undefined>();
  idKey = input('id');
  isPointer = input(false);
  tableRowClicked = output<T>();

  paginationData!: PaginationData;
  columnTypeEnum = ColumnTypeEnum;
  displayedColumns = computed(() => this.config().columns.map(col => col.dataProperty));

  ngOnInit(): void {
    this.paginationDataService.getPaginationDataListener().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(paginationData => this.paginationData = paginationData);
  }

  onTableRowClick(item: T): void {
    this.tableRowClicked.emit(item);
  }

}
