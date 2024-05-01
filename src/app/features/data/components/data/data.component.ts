import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import * as fromApp from "../../../../core/store/app.reducer";
import { getTrainees } from "../../store/trainees.actions";
import { selectTrainees } from "../../store/trainees.selectors";
import { dataTableConfig } from "../../data/data-table-config";
import { TraineesState } from "../../store/trainees.reducer";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataComponent implements OnInit {
  trainees$: Observable<TraineesState>;
  tableConfig = dataTableConfig;

  constructor(private store: Store<fromApp.AppState>) {
    this.trainees$ = store.select(selectTrainees);
  }

  ngOnInit(): void {
    this.store.dispatch(getTrainees());
  }
}
