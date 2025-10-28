import { createFeature, createReducer, createSelector, on } from "@ngrx/store";

import { Trainee, TraineeRow } from "../interfaces/trainee-interface";
import * as TraineesActions from "./trainees.actions";

export interface TraineesState {
  trainees: Trainee[];
  traineesRows: TraineeRow[];
  selectedTraineesRow: TraineeRow | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TraineesState = {
  trainees: [],
  traineesRows: [],
  selectedTraineesRow: null,
  isLoading: false,
  error: null,
};

export const traineesFeature = createFeature({
  name: "trainees",
  reducer: createReducer(
    initialState,
    on(TraineesActions.getTrainees, (state): TraineesState => ({
      ...state,
      trainees: [],
      error: null,
      isLoading: true
    })),
    on(TraineesActions.traineesFetched, (state, { trainees, traineeRows }): TraineesState => ({
      ...state,
      trainees: trainees,
      traineesRows: traineeRows,
      error: null,
      isLoading: false
    })),
    on(TraineesActions.getTraineesError, TraineesActions.createTraineeError, TraineesActions.editTraineeError, TraineesActions.deleteTraineeError, TraineesActions.createTraineeGradeError, (state, { error }): TraineesState => ({
      ...state,
      error,
      isLoading: false
    })),
    on(TraineesActions.createTrainee, (state): TraineesState => ({
      ...state,
      error: null,
      isLoading: true
    })),
    on(TraineesActions.editTrainee, (state, { selectedTraineeRow }): TraineesState => ({
      ...state,
      selectedTraineesRow: selectedTraineeRow,
      error: null,
      isLoading: true
    })),
    on(TraineesActions.setSelectedTraineeRow, (state, { traineeRow }): TraineesState => ({
      ...state,
      selectedTraineesRow: traineeRow,
      error: null,
      isLoading: false
    })),
    on(TraineesActions.createTraineeGrade, (state): TraineesState => ({
      ...state,
      error: null,
      isLoading: true
    })),
  ),
  extraSelectors: ({
                     selectTrainees,
                   }) => ({
    selectTraineesIds: createSelector(
      selectTrainees,
      trainees => trainees.map(trainee => trainee.id)
    )
  })
})
