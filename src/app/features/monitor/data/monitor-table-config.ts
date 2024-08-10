import { DataTableConfig } from "../../../shared/interfaces/data-table-interface";
import { Trainee } from "../../data/interfaces/trainee-interface";
import { SortDirectionEnum } from "../../../shared/enums/sort-direction-enum";
import { SortTypeEnum } from "../../../shared/enums/sort-type-enum";

export const monitorTableConfig: DataTableConfig<Trainee> = {
  columns: [
    { title: "ID", dataProperty: "id" },
    {
      title: "Name",
      dataProperty: "name",
      isSortable: true,
      sortDirection: SortDirectionEnum.none,
      sortType: SortTypeEnum.string
    },
    {
      title: "Average",
      dataProperty: "average",
      isSortable: true,
      sortDirection: SortDirectionEnum.none,
      sortType: SortTypeEnum.integer
    },
    {
      title: "Exams",
      dataProperty: "exams",
      isSortable: true,
      sortDirection: SortDirectionEnum.none,
      sortType: SortTypeEnum.integer
    },
  ],
}

