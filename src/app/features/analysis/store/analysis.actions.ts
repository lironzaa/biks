import { createAction, props } from '@ngrx/store';

import { SubjectType } from '../../data/types/subject-type';

export const setSelectedSubjects = createAction(
  '[Analysis] Set Selected Subjects',
  props<{ selectedSubjects: SubjectType[] }>()
);

export const setSelectedTraineesIds = createAction(
  '[Analysis] Set Selected Trainees Ids',
  props<{ traineesIds: string[] }>()
);
