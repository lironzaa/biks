import { GradeRangeType } from "../types/grade-range-type";
import { SubjectType } from "../types/subject-type";

interface DataFiltersQueryParamsBase {
  page?: string;
  id?: string | null;
  name?: string | null;
  grade?: number | null;
  gradeRange?: GradeRangeType | null;
  subject?: SubjectType | null;
}

export interface DataFiltersQueryParams extends DataFiltersQueryParamsBase {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
}

export interface DataFiltersFormPatchValues extends DataFiltersQueryParamsBase {
  dateRange?: {
    startDate?: string | Date | null;
    endDate?: string | Date | null;
  }
}
