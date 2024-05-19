import { ActionReducerMap } from "@ngrx/store";

import { traineesFeature, TraineesState } from "../../features/data/store/trainees.reducer";

export interface AppState {
  trainees: TraineesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  trainees: traineesFeature.reducer,
};
