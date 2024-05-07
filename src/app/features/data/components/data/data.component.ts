import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import * as fromApp from "../../../../core/store/app.reducer";
import { selectTrainees } from "../../store/trainees.selectors";
import { TraineesState } from "../../store/trainees.reducer";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrl: "./data.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataComponent {
  traineesState$: Observable<TraineesState>;

  constructor(private store: Store<fromApp.AppState>) {
    this.traineesState$ = store.select(selectTrainees);
  }
}
