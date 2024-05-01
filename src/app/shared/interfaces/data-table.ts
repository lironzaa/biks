export interface DataTableConfig {
  columns: DataTableColumn[];
}

export interface DataTableColumn {
  title: string;
  dataProperty: string;
  columnType?: string;
}
