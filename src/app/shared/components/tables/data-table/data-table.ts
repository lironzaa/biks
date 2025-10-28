import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { NgClass, SlicePipe, DatePipe, JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { DataTableConfig } from '../../../interfaces/data-table/data-table-interface';
import { PaginationDataService } from '../../../services/pagination-data/pagination-data.service';
import { GetItemValuePipe } from '../../../pipes/get-item-value-pipe';
import { Pagination } from '../pagination/pagination';
import { TableFilters } from '../table-filters/table-filters';
import { ColumnTypeEnum } from '../../../enums/tables/column-type.enum';
import { Spinner } from '../../spinners/spinner/spinner';

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
    GetItemValuePipe,
    NgClass,
    MatTableModule,
    Spinner,
    JsonPipe,
  ]
})
export class DataTable<T> {
  paginationDataService = inject(PaginationDataService);

  config = input.required<DataTableConfig>();
  items = input.required<T[]>()
  isLoading = input.required<boolean>();
  isPagination = input(true);
  activeItemId = input<string | undefined>();
  idKey = input('id');
  isPointer = input(false);
  tableRowClicked = output<T>();

  paginationData = this.paginationDataService.paginationData;
  columnTypeEnum = signal(ColumnTypeEnum);
  displayedColumns = computed(() => this.config().columns.map(col => col.dataProperty));

  onTableRowClick(item: T): void {
    this.tableRowClicked.emit(item);
  }
}
