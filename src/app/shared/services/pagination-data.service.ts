import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { PaginationData } from "../interfaces/pagination-data-interface";

@Injectable({
  providedIn: "root"
})
export class PaginationDataService {
  private ITEMS_PER_PAGE = 10;
  private paginationData = new BehaviorSubject<PaginationData>({
    currentPage: 1,
    itemsCount: 0,
    pagesCount: 0,
    nextPage: 0,
    hasNextPage: false,
    previousPage: 0,
    hasPreviousPage: false,
    itemsPerPage: this.ITEMS_PER_PAGE
  });

  calculatePaginationData(page: number, itemsCount?: number): PaginationData {
    const updatedItemsCount = itemsCount ?? this.paginationData.value.itemsCount;
    return {
      currentPage: page,
      itemsCount: updatedItemsCount,
      pagesCount: Math.ceil(updatedItemsCount / this.ITEMS_PER_PAGE),
      nextPage: page + 1,
      hasNextPage: this.ITEMS_PER_PAGE * page < updatedItemsCount,
      previousPage: page - 1,
      hasPreviousPage: page > 1,
      itemsPerPage: this.ITEMS_PER_PAGE
    }
  }

  setPaginationData(paginationData: PaginationData): void {
    this.paginationData.next(paginationData);
  }

  getPaginationDataListener(): Observable<PaginationData> {
    return this.paginationData.asObservable();
  }
}
