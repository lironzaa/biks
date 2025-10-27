import { ColumnTypeEnum } from '../../enums/tables/column-type.enum';

export interface DataTableConfig {
  columns: DataTableColumn[];
}

export interface DataTableColumn {
  title: string;
  dataProperty: string;
  columnType: ColumnTypeEnum;
}