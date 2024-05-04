import { ActionReducerMap } from "@ngrx/store";

import * as fromTrainees from "../../features/data/store/trainees.reducer";

export interface AppState {
  trainees: fromTrainees.TraineesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  trainees: fromTrainees.traineesReducer,
};
