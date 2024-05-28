import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { DataTableColumn, DataTableConfig, DataTableItem } from "../../../interfaces/data-table-interface";
import { PaginationDataService } from "../../../services/pagination-data.service";
import { Trainee, TraineeRow } from "../../../../features/data/interfaces/trainee-interface";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  paginationDataService = inject(PaginationDataService);

  @Input({ required: true }) dataTableConfig!: DataTableConfig;
  @Input({
    transform: (items: TraineeRow[] | Trainee[]): DataTableItem[] => items as unknown as DataTableItem[],
    required: true
  }) items: DataTableItem[] = [];
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) filtersForm!: FormGroup;
  @Input() isPointer = false;
  @Input() activeItemId: string | undefined;
  @Input() activeItemIdKey = "id";
  @Output() tableRowClicked = new EventEmitter<DataTableItem>();

  paginationData$ = this.paginationDataService.getPaginationDataListener()

  trackByItemId(index: number, item: DataTableItem): string {
    return (item.id as string);
  }

  trackByItemDataProperty(index: number, item: DataTableColumn): string {
    return item.dataProperty;
  }

  onTableRowClick(item: DataTableItem): void {
    this.tableRowClicked.emit(item);
  }
}
