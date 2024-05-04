import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-table-filters",
  templateUrl: "./table-filters.component.html",
  styleUrl: "./table-filters.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFiltersComponent {
  @Input() filtersForm!: FormGroup;

}
