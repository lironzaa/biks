import { DataTableConfig } from "../../../shared/interfaces/data-table-interface";

export const monitorTableConfig: DataTableConfig = {
  columns: [
    { title: "ID", dataProperty: "id" },
    { title: "Name", dataProperty: "name" },
    { title: "Average", dataProperty: "average" },
    { title: "Exams", dataProperty: "exams" },
  ],
}

