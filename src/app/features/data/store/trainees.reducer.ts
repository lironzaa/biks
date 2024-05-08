import { Trainee, TraineeRow } from "../interfaces/trainee-interface";
import { createReducer, on } from "@ngrx/store";

import {
  createTrainee,
  editTrainee,
  filterTrainees,
  getTrainees,
  setSelectedSubjects,
  setSelectedTraineeRow,
  setSelectedTraineesIds,
  traineesError,
  traineesFetched,
} from "./trainees.actions";
import { SubjectType } from "../types/subject-type";

export interface TraineesState {
  trainees: Trainee[];
  traineesRows: TraineeRow[];
  traineesRowsOrigin: TraineeRow[];
  selectedTraineesRow: TraineeRow | null;
  isLoading: boolean;
  error: string | null;
  selectedSubjects: SubjectType[];
  selectedTraineesIds: string[];
}

const initialState: TraineesState = {
  trainees: [],
  traineesRows: [],
  traineesRowsOrigin: [],
  selectedTraineesRow: null,
  isLoading: false,
  error: null,
  selectedSubjects: [],
  selectedTraineesIds: [],
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
  on(traineesFetched, (state, { trainees, traineeRows }) => ({
    ...state,
    trainees: trainees,
    traineesRows: traineeRows,
    traineesRowsOrigin: traineeRows,
    error: null,
    isLoading: false
  })),
  on(createTrainee, (state) => ({
    ...state,
    error: null,
    isLoading: true
  })),
  on(editTrainee, (state, { selectedTraineeRow }) => ({
    ...state,
    selectedTraineesRow: selectedTraineeRow,
    error: null,
    isLoading: true
  })),
  on(setSelectedTraineeRow, (state, { traineeRow }) => ({
    ...state,
    selectedTraineesRow: traineeRow,
    error: null,
    isLoading: false
  })),
  on(traineesError, (state, { errorMessage }) => ({
    ...state,
    error: errorMessage,
    isLoading: false
  })),
  on(filterTrainees, (state, { traineesRows }) => ({
    ...state,
    traineesRows: traineesRows,
    error: null,
    isLoading: false
  })),
  on(setSelectedSubjects, (state, { selectedSubjects }) => ({
    ...state,
    selectedSubjects: selectedSubjects,
    error: null,
    isLoading: false,
  })),
  on(setSelectedTraineesIds, (state, { traineesIds }) => ({
    ...state,
    selectedTraineesIds: traineesIds,
    error: null,
    isLoading: false,
  })),
)
