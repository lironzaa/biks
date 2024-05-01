import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DataTableColumn, DataTableConfig } from "../../../interfaces/data-table";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  @Input() dataTableConfig!: DataTableConfig;
  @Input() items: any[] = [];
  @Input() isLoading!: boolean;
  @Input() linkPath!: string;
  @Input() isRelativePath!: boolean;

  trackByItemId(index: number, item: any): any {
    return item.id;
  }

  trackByItemDataProperty(index: number, item: DataTableColumn): string {
    return item.dataProperty;
  }
}
