import { Injectable } from '@angular/core';

import { FilterFn } from '../../../shared/types/data-table/filter-fn-type';
import { TraineeRow } from '../interfaces/trainee-interface';
import { DataFiltersQueryParams } from '../interfaces/data-filters-query-params.interface';
import { DataFiltersEnum } from '../enums/data-filters-enum';
import { GradeRangeEnum } from '../enums/grade-range-enum';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {
  createFilterFn(queryParams: DataFiltersQueryParams): FilterFn<TraineeRow> {
    let startDate: Date;
    let endDate: Date;
    const isFilterByDate = queryParams.startDate !== undefined && queryParams.endDate !== undefined;
    if (isFilterByDate) {
      startDate = new Date(queryParams.startDate!);
      endDate = new Date(queryParams.endDate!);
    }

    let gradeQueryParam: number;
    const isFilterByGrade = queryParams.grade !== undefined;
    if (isFilterByGrade) gradeQueryParam = Number(queryParams.grade);

    const isFilterById = queryParams.id !== undefined;
    const isFilterByName = queryParams.name !== undefined;
    const isFilterBySubject = queryParams.subject !== undefined;

    return (item): boolean => {
      let idMatch = true;
      let nameMatch = true;
      let gradeMatch = true;
      let dateMatch = true;
      let subjectMatch = true;

      if (isFilterById) idMatch = item.id === queryParams.id;
      if (isFilterByName) nameMatch = item.name.toLowerCase().includes(queryParams.name!.toLowerCase());
      if (isFilterByGrade) gradeMatch = this.compareAccordingToOperator(item.grade, queryParams.gradeRange, gradeQueryParam);
      if (isFilterByDate) {
        const itemDate = new Date(item.gradeDate);
        dateMatch = startDate <= itemDate && itemDate <= endDate;
      }
      if (isFilterBySubject) subjectMatch = item.subject === queryParams.subject;

      return idMatch && nameMatch && gradeMatch && dateMatch && subjectMatch;
    };
  }

  compareAccordingToOperator(grade: number, gradeRange: string | null | undefined, queryParamsGrade: number): boolean {
    switch (gradeRange) {
      case GradeRangeEnum.greaterThan:
        return grade > queryParamsGrade!;
      case GradeRangeEnum.lessThan:
        return grade < queryParamsGrade!;
      case GradeRangeEnum.equals:
      default:
        return grade === queryParamsGrade!;
    }
  }

  isApplyFilters(queryParams: DataFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === DataFiltersEnum.id || filter === DataFiltersEnum.name || filter === DataFiltersEnum.grade || filter === DataFiltersEnum.startDate || filter === DataFiltersEnum.endDate || filter === DataFiltersEnum.subject) return true;
    }
    return false;
  }
}