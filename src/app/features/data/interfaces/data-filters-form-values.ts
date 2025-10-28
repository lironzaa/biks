import { GradeRangeType } from "../types/grade-range-type";
import { SubjectType } from "../types/subject-type";
import { DataFiltersQueryParams } from "./data-filters-query-params.interface";

export interface DataFiltersFormValues {
  id: string | null;
  name: string | null;
  grade: number | null;
  gradeRange: GradeRangeType | null;
  subject: SubjectType | null;
  dateRange: Partial<{ startDate: string | Date | null, endDate: string | Date | null } | null>;
}

export interface FiltersFormState {
  updatedQueryParams: DataFiltersQueryParams;
  isResetPage: boolean
}
