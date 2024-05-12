import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

import { PaginationData } from "../../../interfaces/pagination-data-interface";
import { PaginationDataService } from "../../../services/pagination-data.service";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit {
  page!: number;

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
