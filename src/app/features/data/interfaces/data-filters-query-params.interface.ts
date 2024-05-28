import { GradeRangeType } from "../types/grade-range-type";

interface DataFiltersQueryParamsBase {
  page?: string;
  id?: string | null;
  grade?: number | null;
  gradeRange?: GradeRangeType | null;
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
