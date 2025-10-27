import { DataTableConfig } from '../../../shared/interfaces/data-table/data-table-interface';
import { DataTablePropsEnum } from '../enums/data-table-props-enum';
import { ColumnTypeEnum } from '../../../shared/enums/tables/column-type.enum';

export const dataTableConfig: DataTableConfig = {
  columns: [
    {
      title: "ID",
      dataProperty: DataTablePropsEnum.id,
      columnType: ColumnTypeEnum.string
    },
    {
      title: "Name",
      dataProperty: DataTablePropsEnum.name,
      columnType: ColumnTypeEnum.string
    },
    {
      title: "Date",
      dataProperty: DataTablePropsEnum.gradeDate,
      columnType: ColumnTypeEnum.date
    },
    {
      title: "Grade",
      dataProperty: DataTablePropsEnum.grade,
      columnType: ColumnTypeEnum.number

    },
    {
      title: "Subject",
      dataProperty: DataTablePropsEnum.subject,
      columnType: ColumnTypeEnum.string

    },
  ],
}

