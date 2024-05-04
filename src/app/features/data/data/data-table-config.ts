import { DataTableConfig } from "../../../shared/interfaces/data-table-interface";

export const dataTableConfig: DataTableConfig = {
  columns: [
    { title: "ID", dataProperty: "id" },
    { title: "Name", dataProperty: "name" },
    { title: "Date", dataProperty: "dateJoined", columnType: "date" },
    { title: "Grade", dataProperty: "grade" },
    { title: "Subject", dataProperty: "subject" },
  ],
}

