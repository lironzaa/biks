import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { PaginationDataService } from "../../../services/pagination-data.service";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  paginationDataService = inject(PaginationDataService);

  page!: number;
  paginationData$ = this.paginationDataService.getPaginationDataListener();

  ngOnInit(): void {
    this.initQueryParamsSub();
  }

  initQueryParamsSub(): void {
    this.route.queryParams.subscribe(queryParams => this.page = queryParams["page"] ? +queryParams["page"] : 1);
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
}
