import { createFeature, createReducer, createSelector, on } from "@ngrx/store";

import { Trainee, TraineeRow } from "../interfaces/trainee-interface";
import {
  createTrainee,
  createTraineeGrade,
  editTrainee,
  filterTrainees,
  getTrainees,
  setSelectedTraineeRow,
  traineesError,
  traineesFetched,
} from "./trainees.actions";

export interface TraineesState {
  trainees: Trainee[];
  traineesOrigin: Trainee[];
  traineesRows: TraineeRow[];
  selectedTraineesRow: TraineeRow | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TraineesState = {
  trainees: [],
  traineesOrigin: [],
  traineesRows: [],
  selectedTraineesRow: null,
  isLoading: false,
  error: null,
};

export const traineesFeature = createFeature({
  name: "trainees",
  reducer: createReducer(
    initialState,
    on(getTrainees, (state): TraineesState => ({
      ...state,
      trainees: [],
      error: null,
      isLoading: true
    })),
    on(traineesFetched, (state, { trainees, traineeRows }): TraineesState => ({
      ...state,
      trainees: trainees,
      traineesOrigin: trainees,
      traineesRows: traineeRows,
      error: null,
      isLoading: false
    })),
    on(createTrainee, (state): TraineesState => ({
      ...state,
      error: null,
      isLoading: true
    })),
    on(editTrainee, (state, { selectedTraineeRow }): TraineesState => ({
      ...state,
      selectedTraineesRow: selectedTraineeRow,
      error: null,
      isLoading: true
    })),
    on(setSelectedTraineeRow, (state, { traineeRow }): TraineesState => ({
      ...state,
      selectedTraineesRow: traineeRow,
      error: null,
      isLoading: false
    })),
    on(traineesError, (state, { errorMessage }): TraineesState => ({
      ...state,
      error: errorMessage,
      isLoading: false
    })),
    on(createTraineeGrade, (state): TraineesState => ({
      ...state,
      error: null,
      isLoading: true
    })),
    on(filterTrainees, (state, { trainees }): TraineesState => ({
      ...state,
      trainees: trainees,
      error: null,
      isLoading: false
    })),
  ),
  extraSelectors: ({
                     selectTraineesOrigin,
                   }) => ({
    selectTraineesIds: createSelector(
      selectTraineesOrigin,
      traineesOrigin => traineesOrigin.map(trainee => trainee.id)
    )
  })
})
