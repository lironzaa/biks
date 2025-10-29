import { DataTableConfig } from '../../../shared/interfaces/data-table/data-table-interface';
import { ColumnTypeEnum } from '../../../shared/enums/tables/column-type.enum';
import { MonitorTablePropsEnum } from '../enums/monitor-table-props-enum';

export const monitorTableConfig: DataTableConfig = {
  columns: [
    {
      title: 'ID',
      dataProperty: MonitorTablePropsEnum.id,
      columnType: ColumnTypeEnum.string
    },
    {
      title: 'Name',
      dataProperty: MonitorTablePropsEnum.name,
      columnType: ColumnTypeEnum.string

    },
    {
      title: 'Average',
      dataProperty: MonitorTablePropsEnum.average,
      columnType: ColumnTypeEnum.number

    },
    {
      title: 'Exams',
      dataProperty: MonitorTablePropsEnum.exams,
      columnType: ColumnTypeEnum.number
    },
  ],
}

