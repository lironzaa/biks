import { createAction, props } from '@ngrx/store';

import {
  CreateTrainee,
  EditTrainee,
  Trainee,
  TraineeRow
} from '../interfaces/trainee-interface';
import { DataFiltersQueryParams } from '../interfaces/data-filters-query-params.interface';
import { GradeCreateData } from '../types/trainee-type';

export const getTrainees = createAction(
  '[Trainees] Get Trainees]',
  props<{ queryParams: DataFiltersQueryParams }>()
);

export const traineesFetched = createAction(
  '[Trainees] Trainees Fetched]',
  props<{ trainees: Trainee[], traineeRows: TraineeRow[] }>()
);

export const getTraineesError = createAction(
  '[Trainees] Get Trainees Error]',
  props<{ error: string }>()
);

export const createTrainee = createAction(
  '[Trainees] Create Trainee]',
  props<{ data: CreateTrainee }>()
);

export const createTraineeError = createAction(
  '[Trainees] Create Trainee Error]',
  props<{ error: string }>()
);

export const editTrainee = createAction(
  '[Trainees] Edit Trainee]',
  props<{ data: EditTrainee, selectedTraineeRow: TraineeRow }>()
);

export const editTraineeError = createAction(
  '[Trainees] Edit Trainee Error]',
  props<{ error: string }>()
);

export const deleteTrainee = createAction(
  '[Trainees] Delete Trainee]',
  props<{ id: string }>()
);

export const deleteTraineeError = createAction(
  '[Trainees] Delete Trainee Error]',
  props<{ error: string }>()
);

export const createTraineeGrade = createAction(
  '[Trainees] Create Trainee Grade]',
  props<{ data: GradeCreateData }>()
);

export const createTraineeGradeError = createAction(
  '[Trainees] Create Trainee Grade Error]',
  props<{ error: string }>()
);

export const setSelectedTraineeRow = createAction(
  '[Trainees] Set Selected Trainee Row]',
  props<{ traineeRow: TraineeRow | null }>()
);