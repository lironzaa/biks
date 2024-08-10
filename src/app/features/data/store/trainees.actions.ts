import { createAction, props } from "@ngrx/store";

import {
  CreateTrainee,
  EditTrainee,
  Trainee,
  TraineeRow
} from "../interfaces/trainee-interface";
import { DataFiltersQueryParams } from "../interfaces/data-filters-query-params.interface";
import { GradeCreateData } from "../types/trainee-type";

export const getTrainees = createAction(
  "[Trainees] Get Trainees]",
  props<{ queryParams: DataFiltersQueryParams }>()
);

export const traineesFetched = createAction(
  "[Trainees] Trainees Fetched]",
  props<{ trainees: Trainee[], traineeRows: TraineeRow[] }>()
);

export const createTrainee = createAction(
  "[Trainees] Create Trainee]",
  props<{ data: CreateTrainee }>()
);

export const editTrainee = createAction(
  "[Trainees] Edit Trainee]",
  props<{ data: EditTrainee, selectedTraineeRow: TraineeRow }>()
);

export const setSelectedTraineeRow = createAction(
  "[Trainees] Set Selected Trainee Row]",
  props<{ traineeRow: TraineeRow | null }>()
);

export const deleteTrainee = createAction(
  "[Trainees] Delete Trainee]",
  props<{ id: string }>()
);

export const traineesError = createAction(
  "[Trainees] Trainees Error]",
  props<{ errorMessage: string }>()
);

export const createTraineeGrade = createAction(
  "[Trainees] Create Trainee Grade]",
  props<{ data: GradeCreateData }>()
);

export const sortTraineesRows = createAction(
  "[Trainees] Sort Trainees Rows]",
  props<{ traineesRows: TraineeRow[] }>()
);

export const sortTrainees = createAction(
  "[Trainees] Sort Trainees]",
  props<{ trainees: Trainee[] }>()
);
