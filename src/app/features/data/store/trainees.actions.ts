import { createAction, props } from '@ngrx/store';

import { Trainee } from "../interfaces/Trainee";

export const getTrainees = createAction(
  '[Trainees] Get Trainees]'
);

export const traineesFetched = createAction(
  '[Trainees] Trainees Fetched]',
  props<{ trainees: Trainee[] }>()
);

export const traineesError = createAction(
  '[Trainees] Trainees Error]',
  props<{ errorMessage: string }>()
);
