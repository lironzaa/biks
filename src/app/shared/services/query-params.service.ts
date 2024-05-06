import { Injectable } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { Observable, ReplaySubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class QueryParamsService {
  private queryParamChanged = new ReplaySubject<Params>();

  constructor(private route: ActivatedRoute) {
    this.initQueryParamsSub();
  }

  initQueryParamsSub(): void {
    this.route.queryParams.subscribe((params) => {
      this.setQueryParamChanged(params);
    });
  }

  setQueryParamChanged(queryParamChanged: Params): void {
    this.queryParamChanged.next(queryParamChanged);
  }

  getQueryParamChangedListener(): Observable<Params> {
    return this.queryParamChanged.asObservable();
  }
}
