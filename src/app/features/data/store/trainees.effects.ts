import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from "ngx-toastr";

import { getTrainees, traineesError, traineesFetched } from "./trainees.actions";
import { Trainee } from "../interfaces/Trainee";
import { PaginationDataService } from "../../../shared/services/pagination-data.service";

@Injectable()
export class TraineesEffects {
  apiUrl = "assets/data.json";

  constructor(
    private actions$: Actions, private http: HttpClient,
    private toastr: ToastrService, private paginationDataService: PaginationDataService
  ) {
  }

  getTrainees = createEffect(() => {
    return this.actions$.pipe(
      ofType(getTrainees),
      switchMap(() => {
        return this.http.get<Trainee[]>(this.apiUrl).pipe(
          map(trainees => {
            const paginationData = this.paginationDataService.calculatePaginationData(trainees.length);
            console.log(paginationData);
            this.paginationDataService.setPaginationData(paginationData);
            return traineesFetched({ trainees });
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
        );
      }));
  });

  handleError(errorMessage: string) {
    this.toastr.error(errorMessage);
    return of(traineesError({ errorMessage }));
  };
}
