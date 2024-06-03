import { createAction, props } from "@ngrx/store";
import { SubjectType } from "../../data/types/subject-type";

export const setSelectedSubjects = createAction(
  "[Trainees] Set Selected Subjects",
  props<{ selectedSubjects: SubjectType[] }>()
);

export const setSelectedTraineesIds = createAction(
  "[Trainees] Set Selected Trainees Ids",
  props<{ traineesIds: string[] }>()
);
