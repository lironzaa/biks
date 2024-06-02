import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";

import { DataTableConfig, DataTableItem } from "../../../interfaces/data-table-interface";
import { PaginationDataService } from "../../../services/pagination-data.service";
import { Trainee, TraineeRow } from "../../../../features/data/interfaces/trainee-interface";
import { PaginationData } from "../../../interfaces/pagination-data-interface";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);
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

  paginationData$ = this.paginationDataService.getPaginationDataListener();
  paginationData!: PaginationData;

  ngOnInit() {
    this.paginationData$.subscribe(paginationData => {
      // console.log(data);
      this.paginationData = paginationData;
      this.cdr.detectChanges();
    })
  }

  onTableRowClick(item: DataTableItem): void {
    this.tableRowClicked.emit(item);
  }
}
