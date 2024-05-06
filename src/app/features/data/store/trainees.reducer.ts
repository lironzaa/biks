import { Trainee, TraineeRow } from "../interfaces/trainee-interface";
import { createReducer, on } from "@ngrx/store";
import {
  createTrainee,
  filterTrainees,
  getTrainees,
  setSelectedTraineeRow,
  traineesError,
  traineesFetched
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
  error: null
};

export const traineesReducer = createReducer(
  initialState,
  on(getTrainees, (state) => ({
    ...state,
    trainees: [],
    traineesOrigin: [],
    error: null,
    isLoading: true
  })),
  on(traineesFetched, (state, action) => ({
    ...state,
    trainees: action.trainees,
    traineesOrigin: action.trainees,
    traineesRows: action.traineeRows,
    error: null,
    isLoading: false
  })),
  on(createTrainee, (state) => ({
    ...state,
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
    trainees: [],
    traineesOrigin: [],
    error: action.errorMessage,
    isLoading: false
  })),
  on(filterTrainees, (state, action) => ({
    ...state,
    trainees: action.trainees,
    error: null,
    isLoading: false
  })),
)
