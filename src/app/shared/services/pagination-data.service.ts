import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { PaginationData } from "../interfaces/pagination-data-interface";

@Injectable({
  providedIn: "root"
})
export class PaginationDataService {
  constructor() {
    console.log("PaginationDataService created!!!!!!!!!!!!!!!");
  }

  private _itemsPerPage: number = this.getItemsPerPageFromLocalStorage();

  get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  set itemsPerPage(itemsPerPage: number) {
    this._itemsPerPage = itemsPerPage;
    localStorage.setItem("itemsPerPage", itemsPerPage.toString());
    this.setPaginationData(this.calculatePaginationData(this.paginationData.value.currentPage, this.paginationData.value.itemsCount));
  }

  private getItemsPerPageFromLocalStorage(): number {
    const storedItemsPerPage = localStorage.getItem("itemsPerPage");
    return storedItemsPerPage ? +storedItemsPerPage : 10;
  }

  private paginationData = new BehaviorSubject<PaginationData>({
    currentPage: 1,
    itemsCount: 0,
    totalPages: 0,
    nextPage: 0,
    hasNextPage: false,
    previousPage: 0,
    hasPreviousPage: false,
    itemsPerPage: this._itemsPerPage,
    from: 0,
    to: 0,
    isPaginated: false,
    isResetPage: false
  });

  calculatePaginationData(page: number, itemsCount?: number | undefined, isPaginated?: boolean, isResetPage?: boolean): PaginationData {
    const updatedItemsCount = itemsCount ?? this.paginationData.value.itemsCount;
    const itemsPerPage = this._itemsPerPage;
    const to = this.paginationData.value.hasNextPage ? page * itemsPerPage : Math.min(page * itemsPerPage, updatedItemsCount);

    return {
      currentPage: page,
      itemsCount: updatedItemsCount,
      totalPages: Math.ceil(updatedItemsCount / itemsPerPage),
      nextPage: page + 1,
      hasNextPage: itemsPerPage * page < updatedItemsCount,
      previousPage: page - 1,
      hasPreviousPage: page > 1,
      itemsPerPage: itemsPerPage,
      from: ((page - 1) * itemsPerPage) + 1,
      to: to,
      isPaginated: isPaginated ? isPaginated : false,
      isResetPage: isResetPage ? isResetPage : false
    }
  }

  setPaginationData(paginationData: PaginationData): void {
    this.paginationData.next(paginationData);
  }

  getPaginationDataListener(): Observable<PaginationData> {
    return this.paginationData.asObservable();
  }
}
