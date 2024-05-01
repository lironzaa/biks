import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

import { PaginationData } from "../interfaces/pagination-data";

@Injectable({
  providedIn: 'root'
})
export class PaginationDataService {
  ITEMS_PER_PAGE = 10;
  private paginationData = new BehaviorSubject<PaginationData>({
    itemsCount: 0,
    pagesCount: 0,
    nextPage: 0,
    hasNextPage: false,
    previousPage: 0,
    hasPreviousPage: false
  });

  calculatePaginationData(itemsCount: number): PaginationData {
    return {
      itemsCount: itemsCount,
      pagesCount: Math.ceil(itemsCount / this.ITEMS_PER_PAGE),
      nextPage: 2,
      hasNextPage: itemsCount > 10,
      previousPage: 0,
      hasPreviousPage: false
    }
  }

  setPaginationData(paginationData: PaginationData): void {
    this.paginationData.next(paginationData);
  }

  getPaginationDataListener(): Observable<PaginationData> {
    return this.paginationData.asObservable();
  }
}
