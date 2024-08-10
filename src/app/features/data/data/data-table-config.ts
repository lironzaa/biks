import { DataTableConfig } from "../../../shared/interfaces/data-table-interface";
import { SortDirectionEnum } from "../../../shared/enums/sort-direction-enum";
import { SortTypeEnum } from "../../../shared/enums/sort-type-enum";
import { TraineeRow } from "../interfaces/trainee-interface";
import { DataTablePropsEnum } from "../enums/data-table-props-enum";

export const dataTableConfig: DataTableConfig<TraineeRow> = {
  columns: [
    { title: "ID", dataProperty: DataTablePropsEnum.id },
    {
      title: "Name",
      dataProperty: DataTablePropsEnum.name,
      isSortable: true,
      sortDirection: SortDirectionEnum.none,
      sortType: SortTypeEnum.string
    },
    {
      title: "Date",
      dataProperty: DataTablePropsEnum.gradeDate,
      columnType: "date",
      isSortable: true,
      sortDirection: SortDirectionEnum.none,
      sortType: SortTypeEnum.string
    },
    {
      title: "Grade",
      dataProperty: DataTablePropsEnum.grade,
      isSortable: true,
      sortDirection: SortDirectionEnum.none,
      sortType: SortTypeEnum.integer
    },
    {
      title: "Subject",
      dataProperty: DataTablePropsEnum.subject,
      isSortable: true,
      sortDirection: SortDirectionEnum.none,
      sortType: SortTypeEnum.string
    },
  ],
}

