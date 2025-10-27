import { GradeRangeType } from "../types/grade-range-type";
import { DataFiltersQueryParams } from "./data-filters-query-params.interface";

export interface DataFiltersFormValues {
  id: string | null;
  grade: number | null;
  gradeRange: GradeRangeType | null;
  dateRange: Partial<{ startDate: string | Date | null, endDate: string | Date | null } | null>;
}

export interface FiltersFormState {
  updatedQueryParams: DataFiltersQueryParams;
  isResetPage: boolean
}
