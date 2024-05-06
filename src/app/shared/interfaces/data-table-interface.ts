export interface DataTableConfig {
  columns: DataTableColumn[];
}

export interface DataTableColumn {
  title: string;
  dataProperty: string;
  columnType?: "date";
}

export interface DataTableFiltersValues {
  [key: string]: string | null;
}

export interface DataTableItem {
  [key: string]: string;
}
