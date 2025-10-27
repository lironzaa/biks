import { inject, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PaginationDataService } from '../services/pagination-data/pagination-data.service';
import { FilterFn } from '../types/data-table/filter-fn-type';

@Pipe({
  name: 'filterSortItems',
  pure: true,
})
export class FilterSortItemsPipe<T> implements PipeTransform {
  paginationDataService = inject(PaginationDataService);
  route = inject(ActivatedRoute);

  transform(dataTableItems: T[], filterFn: FilterFn<T> | undefined): T[] {
    let items = [ ...dataTableItems ];

    if (filterFn) items = items.filter(filterFn);

    this.setPaginationData(items.length);

    return items;
  }

  private setPaginationData(itemsCount: number): void {
    const paginationData = this.paginationDataService.calculatePaginationData(this.route.snapshot.queryParams['page'] ? +this.route.snapshot.queryParams['page'] : 1, itemsCount);
    this.paginationDataService.setPaginationData(paginationData);
  }
}
