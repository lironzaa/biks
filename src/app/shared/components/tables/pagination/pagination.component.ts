import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { distinctUntilChanged, skip, takeUntil } from "rxjs";
import { map } from "rxjs/operators";
import { FormBuilder, FormControl } from "@angular/forms";

import { PaginationDataService } from "../../../services/pagination-data.service";
import { Unsubscribe } from "../../../class/unsubscribe.class";
import { FormUtilitiesService } from "../../../services/form-utilities.service";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent extends Unsubscribe implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  paginationDataService = inject(PaginationDataService);
  formUtilitiesService = inject(FormUtilitiesService);
  fb = inject(FormBuilder);

  currentPage!: number;
  paginationData$ = this.paginationDataService.getPaginationDataListener();
  totalPages = 0;
  paginationOptions = [ 10, 25, 50 ];

  paginationForm = this.fb.group({
    "itemsPerPage": new FormControl<number>(this.paginationDataService.itemsPerPage, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.initQueryParamsSub();
    this.initPaginationDataSub();
    this.initPaginationFormSub();
  }

  initQueryParamsSub(): void {
    this.route.queryParams.subscribe(queryParams => this.currentPage = queryParams["page"] ? +queryParams["page"] : 1);
  }

  initPaginationDataSub(): void {
    this.paginationData$.pipe(
      map(paginationData => paginationData.totalPages),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(totalPages => this.totalPages = totalPages);
  }

  initPaginationFormSub(): void {
    this.paginationForm.get("itemsPerPage")?.valueChanges
      .pipe(
        distinctUntilChanged(),
        skip(1),
        takeUntil(this.unsubscribe$)
      ).subscribe(itemsPerPage => {
      this.currentPage = 1;
      this.paginationDataService.itemsPerPage = itemsPerPage;
      this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.currentPage));
      this.navigate(this.currentPage);
    })
  }

  navigateToPage(navigateType: "previousPage" | "nextPage" | "firstPage" | "lastPage"): void {
    switch (navigateType) {
      case "previousPage":
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.currentPage - 1, undefined, true));
        this.navigate(this.currentPage - 1);
        break;
      case "nextPage":
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(this.currentPage + 1, undefined, true));
        this.navigate(this.currentPage + 1);
        break;
      case "firstPage":
        this.paginationDataService.setPaginationData(this.paginationDataService.calculatePaginationData(1, undefined, true));
        this.navigate(1);
        break;
      case "lastPage":
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
        queryParamsHandling: "merge",
      });
  }
}
