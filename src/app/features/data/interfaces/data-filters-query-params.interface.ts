import { GradeRangeType } from "../types/grade-range-type";

export interface DataFiltersQueryParams {
  page?: string;
  id?: string;
  grade?: number | null;
  gradeRange?: GradeRangeType;
  startDate?: string | Date;
  endDate?: string | Date;
}
