import { SortDirectionEnum } from "../enums/sort-direction-enum";
import { SortTypeEnum } from "../enums/sort-type-enum";

export interface DataTableConfig<T> {
  columns: DataTableColumn<T>[];
}

export interface DataTableBaseColumn<T> {
  title: string;
  dataProperty: keyof T;
  columnType?: "date";
}

export interface DataTableSortableColumn<T> extends DataTableBaseColumn<T> {
  isSortable: true;
  sortDirection: SortDirectionEnum;
  sortType: SortTypeEnum;
}

export interface DataTableNonSortableColumn<T> extends DataTableBaseColumn<T> {
  isSortable?: false;
  sortDirection?: never;
  sortType?: never;
}

export type DataTableColumn<T> = DataTableSortableColumn<T> | DataTableNonSortableColumn<T>;

export interface DataTableFiltersValues {
  [key: string]: unknown;
}

export interface DataTableItem {
  [key: string]: string | number;
}
