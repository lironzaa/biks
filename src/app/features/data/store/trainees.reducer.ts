import { Trainee } from "../interfaces/trainee-interface";
import { createReducer, on } from "@ngrx/store";
import { filterTrainees, getTrainees, traineesError, traineesFetched } from "./trainees.actions";

export interface TraineesState {
  trainees: Trainee[];
  traineesOrigin: Trainee[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TraineesState = {
  trainees: [],
  traineesOrigin: [],
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
