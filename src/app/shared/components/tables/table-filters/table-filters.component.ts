import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-table-filters",
  templateUrl: "./table-filters.component.html",
  styleUrl: "./table-filters.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFiltersComponent {
}
