import { GradeRangeType } from '../types/grade-range-type';
import { SubjectType } from '../types/subject-type';

interface DataFiltersQueryParamsBase {
  id?: string | null;
  page?: string;
  grade?: number | null;
  gradeRange?: GradeRangeType | null;
  name?: string | null;
  subject?: SubjectType | null;
}

export interface DataFiltersQueryParams extends DataFiltersQueryParamsBase {
  endDate?: string | Date | null;
  startDate?: string | Date | null;
}

export interface DataFiltersFormPatchValues extends DataFiltersQueryParamsBase {
  dateRange?: {
    endDate?: string | Date | null;
    startDate?: string | Date | null;
  }
}
