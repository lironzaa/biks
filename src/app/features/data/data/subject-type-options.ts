import { SubjectType } from '../types/subject-type';
import { AppSelectItem } from '../../../shared/interfaces/general/app-select-item.interface';

export const SubjectTypeOptions: AppSelectItem<SubjectType, SubjectType>[] = [
  { id: 'Math', label: 'Math' },
  { id: 'Algebra', label: 'Algebra' },
  { id: 'Chemistry', label: 'Chemistry' },
  { id: 'Biology', label: 'Biology' },
  { id: 'Geography', label: 'Geography' }
];
