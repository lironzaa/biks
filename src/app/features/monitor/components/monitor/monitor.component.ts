import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { FormUtilitiesService } from "../../../../shared/services/form-utilities.service";
import { selectTrainees, selectTraineesIds } from "../../../data/store/trainees.selectors";
import * as fromApp from "../../../../core/store/app.reducer";
import { TraineesState } from "../../../data/store/trainees.reducer";
import { monitorTableConfig } from "../../data/monitor-table-config";

@Component({
  selector: "app-monitor",
  templateUrl: "./monitor.component.html",
  styleUrl: "./monitor.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorComponent {
  traineesState$: Observable<TraineesState>;
  traineesStateIds$: Observable<string[]>;

  monitorFiltersForm = this.fb.group({
    "ids": new FormControl<string>(""),
    "names": new FormControl<string>(""),
    "state": new FormControl<string>(""),
  });

  monitorTableConfig = monitorTableConfig;

  constructor(protected formUtilitiesService: FormUtilitiesService, private fb: FormBuilder,
              private store: Store<fromApp.AppState>) {
    this.traineesStateIds$ = store.select(selectTraineesIds);
    this.traineesState$ = store.select(selectTrainees);
  }

}
