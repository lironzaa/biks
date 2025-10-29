import { SubjectType } from '../types/subject-type';
import { AppSelectItem } from '../../../shared/interfaces/general/app-select-item.interface';

export const SubjectTypeOptions: AppSelectItem<SubjectType, SubjectType>[] = [
  { id: 'Math', label: 'Math' },
  { id: 'Chemistry', label: 'Chemistry' },
  { id: 'Geography', label: 'Geography' },
  { id: 'Physics', label: 'Physics' },
  { id: 'History', label: 'History' },
  { id: 'English', label: 'English' },
  { id: 'Computer Science', label: 'Computer Science' },
  { id: 'Economics', label: 'Economics' },
  { id: 'Biology', label: 'Biology' },
  { id: 'Physical Education', label: 'Physical Education' }
];
