import { ActionReducerMap } from "@ngrx/store";

import { traineesFeature, TraineesState } from "../../features/data/store/trainees.reducer";
import { analysisFeature, AnalysisState } from "../../features/analysis/store/analysis.reducer";

export interface AppState {
  trainees: TraineesState;
  analysis: AnalysisState;
}

export const appReducers: ActionReducerMap<AppState> = {
  trainees: traineesFeature.reducer,
  analysis: analysisFeature.reducer,
};
