import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs";

import { DataTableConfig, DataTableItem } from "../../../interfaces/data-table-interface";
import { PaginationDataService } from "../../../services/pagination-data.service";
import { Trainee, TraineeRow } from "../../../../features/data/interfaces/trainee-interface";
import { Unsubscribe } from "../../../class/unsubscribe.class";
import { PaginationData } from "../../../interfaces/pagination-data-interface";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent extends Unsubscribe implements OnInit {
  paginationDataService = inject(PaginationDataService);

  @Input() filterFn!: ((item: DataTableItem) => boolean) | undefined;
  @Input({ required: true }) dataTableConfig!: DataTableConfig;
  @Input({
    transform: (items: TraineeRow[] | Trainee[]): DataTableItem[] => items as unknown as DataTableItem[],
    required: true
  }) items: DataTableItem[] = [];
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) filtersForm!: FormGroup;
  @Input() isPointer = false;
  @Input() activeItemId: string | undefined;
  @Input() idKey = "id";
  @Output() tableRowClicked = new EventEmitter<DataTableItem>();

  paginationData!: PaginationData;

  ngOnInit(): void {
    this.paginationDataService.getPaginationDataListener().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(paginationData => this.paginationData = paginationData);
  }

  onTableRowClick(item: DataTableItem): void {
    this.tableRowClicked.emit(item);
  }
}
