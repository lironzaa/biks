import { Trainee, TraineeRow } from "../interfaces/trainee-interface";
import { createReducer, on } from "@ngrx/store";
import {
  createTrainee,
  editTrainee,
  filterTrainees,
  getTrainees,
  setSelectedTraineeRow,
  traineesError,
  traineesFetched
} from "./trainees.actions";

export interface TraineesState {
  trainees: Trainee[];
  traineesRows: TraineeRow[];
  traineesRowsOrigin: TraineeRow[];
  selectedTraineesRow: TraineeRow | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TraineesState = {
  trainees: [],
  traineesRows: [],
  traineesRowsOrigin: [],
  selectedTraineesRow: null,
  isLoading: false,
  error: null
};

export const traineesReducer = createReducer(
  initialState,
  on(getTrainees, (state) => ({
    ...state,
    trainees: [],
    traineesRowsOrigin: [],
    error: null,
    isLoading: true
  })),
  on(traineesFetched, (state, action) => ({
    ...state,
    trainees: action.trainees,
    traineesRows: action.traineeRows,
    traineesRowsOrigin: action.traineeRows,
    error: null,
    isLoading: false
  })),
  on(createTrainee, (state) => ({
    ...state,
    error: null,
    isLoading: true
  })),
  on(editTrainee, (state, action) => ({
    ...state,
    selectedTraineesRow: action.selectedTraineeRow,
    error: null,
    isLoading: true
  })),
  on(setSelectedTraineeRow, (state, action) => ({
    ...state,
    selectedTraineesRow: action.traineeRow,
    error: null,
    isLoading: false
  })),
  on(traineesError, (state, action) => ({
    ...state,
    error: action.errorMessage,
    isLoading: false
  })),
  on(filterTrainees, (state, action) => ({
    ...state,
    traineesRows: action.traineesRows,
    error: null,
    isLoading: false
  })),
)
