import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { PaginationData } from "../../../interfaces/pagination-data-interface";
import { PaginationDataService } from "../../../services/pagination-data.service";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy {
  page!: number;

  private queryParamsSub!: Subscription;
  paginationData$: Observable<PaginationData>;

  constructor(private route: ActivatedRoute, private router: Router,
              private paginationDataService: PaginationDataService
  ) {
    this.paginationData$ = this.paginationDataService.getPaginationDataListener();
  }

  ngOnInit(): void {
    this.initQueryParamsSub();
  }

  initQueryParamsSub(): void {
    this.queryParamsSub = this.route.queryParams
      .subscribe(queryParams => {
        this.page = queryParams["page"] ? +queryParams["page"] : 1;
        // console.log(this.page);
      });
  }

  navigateToPage(navigateType: "previousPage" | "nextPage"): void {
    switch (navigateType) {
      case "previousPage":
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.page - 1));
        this.navigate(this.page - 1);
        break;
      case "nextPage":
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.page + 1));
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
        queryParamsHandling: "merge",
      });
  }

  ngOnDestroy(): void {
    if (!this.queryParamsSub.closed) this.queryParamsSub.unsubscribe();
  }
}
