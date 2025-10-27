import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, skip } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PaginationDataService } from '../../../services/pagination-data/pagination-data.service';
import { PaginationSelectItems } from '../../../data/pagination/pagination-select-items';
import { SelectInput } from '../../inputs/select-input/select-input';
import { Button } from '../../buttons/button/button';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ Button, SelectInput, ReactiveFormsModule, AsyncPipe ]
})
export class Pagination implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  paginationDataService = inject(PaginationDataService);
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);

  currentPage!: number;
  paginationData$ = this.paginationDataService.getPaginationDataListener();
  totalPages = 0;
  paginationSelectItems = PaginationSelectItems;

  paginationForm = this.fb.group({
    'itemsPerPage': new FormControl<string>(this.paginationDataService.itemsPerPage.toString(), { nonNullable: true }),
  });

  ngOnInit(): void {
    this.initQueryParamsSub();
    this.initPaginationDataSub();
    this.initPaginationFormSub();
  }

  initQueryParamsSub(): void {
    this.route.queryParams.subscribe(queryParams => this.currentPage = queryParams['page'] ? +queryParams['page'] : 1);
  }

  initPaginationDataSub(): void {
    this.paginationData$.pipe(
      map(paginationData => paginationData.totalPages),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(totalPages => this.totalPages = totalPages);
  }

  initPaginationFormSub(): void {
    this.paginationForm.get('itemsPerPage')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        skip(1),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(itemsPerPage => {
      this.currentPage = 1;
      this.paginationDataService.itemsPerPage = +itemsPerPage;
      this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.currentPage));
      this.navigate(this.currentPage);
    })
  }

  navigateToPage(navigateType: 'previousPage' | 'nextPage' | 'firstPage' | 'lastPage'): void {
    switch (navigateType) {
      case 'previousPage':
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.currentPage - 1, undefined, true));
        this.navigate(this.currentPage - 1);
        break;
      case 'nextPage':
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.currentPage + 1, undefined, true));
        this.navigate(this.currentPage + 1);
        break;
      case 'firstPage':
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(1, undefined, true));
        this.navigate(1);
        break;
      case 'lastPage':
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.totalPages, undefined, true));
        this.navigate(this.totalPages);
        break;
    }
  }

  navigate(page: number) {
    const queryParams = {
      page,
    }
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
      });
  }
}
