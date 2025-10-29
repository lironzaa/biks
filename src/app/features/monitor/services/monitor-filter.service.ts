import { Injectable } from '@angular/core';

import { FilterFn } from '../../../shared/types/data-table/filter-fn-type';
import { Trainee } from '../../data/interfaces/trainee-interface';
import { MonitorsFiltersQueryParams } from '../interfaces/monitors-filters-query-params.interface';
import { MonitorFiltersEnum } from '../enums/monitor-filters-enum';
import { IsPassedIsFailedQueryParamEnum } from '../enums/is-passed-is-failed-query-param-enum';
import { PASSING_THRESHOLD } from '../../../shared/const/app.constants';

@Injectable({
  providedIn: 'root'
})
export class MonitorFilterService {
  isApplyFilters(queryParams: MonitorsFiltersQueryParams): boolean {
    for (const filter in queryParams) {
      if (filter === MonitorFiltersEnum.ids || filter === MonitorFiltersEnum.name || filter === MonitorFiltersEnum.isPassed || filter === MonitorFiltersEnum.isFailed) return true;
    }
    return false;
  }

  createFilterFn(queryParams: MonitorsFiltersQueryParams): FilterFn<Trainee> {
    const lowerNameQueryParam = queryParams.name?.toLowerCase();
    const isFilterByName = lowerNameQueryParam !== undefined;

    const idsArray = typeof queryParams.ids === 'string' ? queryParams.ids.split(',') : queryParams.ids;
    const isFilterByIds = idsArray !== undefined && idsArray !== null && idsArray.length > 0;

    const showPassed = queryParams.isPassed === undefined || queryParams.isPassed === IsPassedIsFailedQueryParamEnum.true || queryParams.isPassed === true;
    const showFailed = queryParams.isFailed === undefined || queryParams.isFailed === IsPassedIsFailedQueryParamEnum.true || queryParams.isFailed === true;

    return (item: Trainee): boolean => {
      let nameMatch = true;
      let idMatch = true;
      let statusMatch = true;

      if (isFilterByIds) {
        idMatch = idsArray!.includes(item.id);
      }

      if (isFilterByName) {
        const itemNameLower = (item.name).toLowerCase();
        nameMatch = itemNameLower.includes(lowerNameQueryParam!);
      }

      const isPassed = item.average >= PASSING_THRESHOLD;
      const isFailed = item.average < PASSING_THRESHOLD;

      if (!showPassed && isPassed) {
        statusMatch = false;
      }
      if (!showFailed && isFailed) {
        statusMatch = false;
      }

      return nameMatch && idMatch && statusMatch;
    }
  }
}