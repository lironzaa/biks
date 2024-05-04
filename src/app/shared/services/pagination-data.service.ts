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

  calculatePaginationData(itemsCount: number, page: number): PaginationData {
    return {
      currentPage: page,
      itemsCount: itemsCount,
      pagesCount: Math.ceil(itemsCount / this.ITEMS_PER_PAGE),
      nextPage: page + 1,
      hasNextPage: this.ITEMS_PER_PAGE * page < itemsCount,
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
