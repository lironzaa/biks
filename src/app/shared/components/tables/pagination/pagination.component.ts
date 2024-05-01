import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { PaginationData } from "../../../interfaces/pagination-data";
import { PaginationDataService } from "../../../services/pagination-data.service";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy {
  paginationData!: PaginationData;
  page!: number;

  private queryParamsSub!: Subscription;
  private paginationDataSub!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
              private paginationDataService: PaginationDataService
              // private queryParamsService: QueryParamsService) {
  ) {
  }

  ngOnInit(): void {
    this.initQueryParamsSub();
    this.initPaginationDataSub();
  }

  initQueryParamsSub(): void {
    this.queryParamsSub = this.route.queryParams
      .subscribe(queryParams => {
        this.page = queryParams['page'] ? +queryParams['page'] : 1;
        console.log(this.page);
      });
  }

  initPaginationDataSub(): void {
    this.paginationDataSub = this.paginationDataService.getPaginationDataListener()
      .subscribe(paginationData => {
        this.paginationData = paginationData;
        console.log(this.paginationData);
      });
  }

  navigateToPage(navigateType: 'previousPage' | 'nextPage'): void {
    switch (navigateType) {
      case "previousPage":
        this.navigate(this.page - 1);
        break;
      case "nextPage":
        this.navigate(this.page + 1);
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

  ngOnDestroy(): void {
    this.queryParamsSub.unsubscribe();
    this.paginationDataSub.unsubscribe();
  }
}
