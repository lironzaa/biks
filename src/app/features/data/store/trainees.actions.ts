import { createAction, props } from "@ngrx/store";

import { CreateTrainee, Trainee, TraineeRow } from "../interfaces/trainee-interface";
import { DataFiltersQueryParams } from "../interfaces/data-filters-query-params.interface";

export const getTrainees = createAction(
  "[Trainees] Get Trainees]",
  props<DataFiltersQueryParams>()
);

export const traineesFetched = createAction(
  "[Trainees] Trainees Fetched]",
  props<{ trainees: Trainee[], traineeRows: TraineeRow[] }>()
);

export const createTrainee = createAction(
  "[Trainees] Create Trainee]",
  props<{ data: CreateTrainee }>()
);

export const setSelectedTraineeRow = createAction(
  "[Trainees] Set Selected Trainee Row]",
  props<{ traineeRow: TraineeRow }>()
);

export const traineesError = createAction(
  "[Trainees] Trainees Error]",
  props<{ errorMessage: string }>()
);

export const filterTrainees = createAction(
  "[Trainees] Filter Trainees]",
  props<{ trainees: Trainee[] }>()
);
