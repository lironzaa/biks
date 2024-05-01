import { Trainee } from "../interfaces/Trainee";
import { createReducer, on } from "@ngrx/store";
import { getTrainees, traineesError, traineesFetched } from "./trainees.actions";

export interface TraineesState {
  trainees: Trainee[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TraineesState = {
  trainees: [],
  isLoading: false,
  error: null
};

export const traineesReducer = createReducer(
  initialState,
  on(getTrainees, (state) => ({
    ...state,
    trainees: [],
    error: null,
    isLoading: true
  })),
  on(traineesFetched, (state, action) => ({
    ...state,
    trainees: action.trainees,
    error: null,
    isLoading: false
  })),
  on(traineesError, (state, action) => ({
    ...state,
    trainees: [],
    error: action.errorMessage,
    isLoading: false
  })),
)
