import { inject, Injectable, signal } from '@angular/core';

import { PaginationData } from '../../interfaces/data-table/pagination-data-interface';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { LocalStorageKeysEnum } from '../../enums/local-storage/local-storage-keys.enum';

@Injectable()
export class PaginationDataService {
  private localStorageService = inject(LocalStorageService);

  private getItemsPerPageFromLocalStorage(): number {
    const storedItemsPerPage = this.localStorageService.getItem(LocalStorageKeysEnum.itemsPerPage);
    return storedItemsPerPage ? +storedItemsPerPage : 10;
  }

  private readonly _itemsPerPage = signal(this.getItemsPerPageFromLocalStorage());
  readonly itemsPerPage = this._itemsPerPage.asReadonly();
  private readonly _paginationData = signal<PaginationData>({
    currentPage: 1,
    itemsCount: 0,
    totalPages: 0,
    nextPage: 0,
    hasNextPage: false,
    previousPage: 0,
    hasPreviousPage: false,
    itemsPerPage: this._itemsPerPage(),
    from: 0,
    to: 0,
    isPaginated: false,
  });
  readonly paginationData = this._paginationData.asReadonly();

  setItemsPerPage(itemsPerPage: number): void {
    this._itemsPerPage.set(itemsPerPage);
    this.localStorageService.setItem(LocalStorageKeysEnum.itemsPerPage, itemsPerPage.toString());
  }

  calculatePaginationData(page: number, itemsCount?: number | undefined, isPaginated?: boolean): PaginationData {
    const updatedItemsCount = itemsCount ?? this._paginationData().itemsCount;
    const itemsPerPage = this._itemsPerPage();
    const currentData = this._paginationData();
    const to = currentData.hasNextPage ? page * itemsPerPage : Math.min(page * itemsPerPage, updatedItemsCount);

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
    }
  }

  setPaginationData(paginationData: PaginationData): void {
    this._paginationData.set(paginationData);
  }
}
