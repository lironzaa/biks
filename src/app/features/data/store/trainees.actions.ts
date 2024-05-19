import { createAction, props } from "@ngrx/store";

import {
  CreateTrainee,
  EditTrainee,
  Trainee,
  TraineeRow
} from "../interfaces/trainee-interface";
import { DataFiltersQueryParams } from "../interfaces/data-filters-query-params.interface";
import { SubjectType } from "../types/subject-type";
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

export const filterTraineesRows = createAction(
  "[Trainees] Filter Trainees Rows]",
  props<{ traineesRows: TraineeRow[] }>()
);

export const filterTrainees = createAction(
  "[Trainees] Filter Trainees]",
  props<{ trainees: Trainee[] }>()
);

export const setSelectedSubjects = createAction(
  "[Trainees] Set Selected Subjects",
  props<{ selectedSubjects: SubjectType[] }>()
);

export const setSelectedTraineesIds = createAction(
  "[Trainees] Set Selected Trainees Ids",
  props<{ traineesIds: string[] }>()
);
