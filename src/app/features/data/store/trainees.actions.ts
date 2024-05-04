import { createAction, props } from "@ngrx/store";

import { Trainee } from "../interfaces/trainee-interface";

export const getTrainees = createAction(
  "[Trainees] Get Trainees]"
);

export const traineesFetched = createAction(
  "[Trainees] Trainees Fetched]",
  props<{ trainees: Trainee[] }>()
);

export const traineesError = createAction(
  "[Trainees] Trainees Error]",
  props<{ errorMessage: string }>()
);

export const filterTrainees = createAction(
  "[Trainees] Filter Trainees]",
  props<{ trainees: Trainee[] }>()
);
