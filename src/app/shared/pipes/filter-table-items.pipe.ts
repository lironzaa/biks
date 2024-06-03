import { inject, Pipe, PipeTransform } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { DataTableItem } from "../interfaces/data-table-interface";
import { PaginationDataService } from "../services/pagination-data.service";
import { FilterFn } from "../types/filter-fn-type";

@Pipe({
  name: "filterTableItems",
  pure: true
})
export class FilterTableItemsPipe implements PipeTransform {
  paginationDataService = inject(PaginationDataService);
  route = inject(ActivatedRoute);

  transform(dataTableItems: DataTableItem[], filterFn: FilterFn | undefined): DataTableItem[] {
    if (!filterFn) {
      this.setPaginationData(dataTableItems.length);
      return dataTableItems;
    }

    const filteredItems = dataTableItems.filter(filterFn);
    this.setPaginationData(filteredItems.length);
    return filteredItems;
  }

  setPaginationData(itemsCount: number): void {
    const paginationData = this.paginationDataService.calculatePaginationData(this.route.snapshot.queryParams.page ? +this.route.snapshot.queryParams.page : 1, itemsCount);
    this.paginationDataService.setPaginationData(paginationData);
  }
}
