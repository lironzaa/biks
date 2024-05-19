import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { traineesFeature, TraineesState } from "../../store/trainees.reducer";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrl: "./data.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataComponent {
  traineesState$: Observable<TraineesState>;

  constructor(private store: Store) {
    this.traineesState$ = store.select(traineesFeature.selectTraineesState);
  }
}
