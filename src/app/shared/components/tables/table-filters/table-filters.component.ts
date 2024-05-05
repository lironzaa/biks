import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { FormUtilitiesService } from "../../../services/form-utilities.service";

@Component({
  selector: "app-table-filters",
  templateUrl: "./table-filters.component.html",
  styleUrl: "./table-filters.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFiltersComponent {
  @Input() filtersForm!: FormGroup;

  constructor(protected formUtilitiesService: FormUtilitiesService) {
  }

}
