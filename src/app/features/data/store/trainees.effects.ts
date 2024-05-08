import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";

import {
  createTrainee,
  createTraineeGrade,
  deleteTrainee,
  editTrainee,
  getTrainees,
  traineesError,
  traineesFetched
} from "./trainees.actions";
import { CreateTraineeGrade, Trainee, TraineeRow } from "../interfaces/trainee-interface";
import { PaginationDataService } from "../../../shared/services/pagination-data.service";
import { environment } from "../../../../environments/environment";
import { DataFiltersQueryParams } from "../interfaces/data-filters-query-params.interface";
import {
  CreateOrUpdateGradeResponse,
  CreateUpdateDeleteTraineeResponse
} from "../interfaces/trainee-api-responses.interface";

@Injectable()
export class TraineesEffects {
  baseUrl = environment.baseUrl;
  apiPrefix = this.baseUrl + "trainees";
  gradesApiPrefix = this.baseUrl + "grades";

  constructor(
    private actions$: Actions, private http: HttpClient,
    private toastr: ToastrService, private paginationDataService: PaginationDataService,
    private route: ActivatedRoute
  ) {
  }

  mapTraineeRows(trainees: Trainee[], traineeRows: TraineeRow[]) {
    trainees.flatMap(trainee => {
      trainee.grades.map(grade => {
        traineeRows.push({
            id: trainee.id,
            gradeId: grade.id,
            name: trainee.name,
            email: trainee.email,
            dateJoined: trainee.dateJoined,
            address: trainee.address,
            city: trainee.city,
            country: trainee.country,
            zip: trainee.zip,
            grade: grade.grade,
            gradeDate: grade.date,
            subject: grade.subject,
          }
        )
      })
    })
  }

  getTrainees = createEffect(() => {
    return this.actions$.pipe(
      ofType(getTrainees),
      switchMap((getTraineesData) => {
        return this.http.get<Trainee[]>(`${ this.apiPrefix }?_embed=grades`).pipe(
          map(trainees => {
            const traineeRows: TraineeRow[] = [];
            this.mapTraineeRows(trainees, traineeRows);
            const calculatedPage = getTraineesData.page ? +getTraineesData.page : 1;
            const paginationData = this.paginationDataService.calculatePaginationData(calculatedPage, traineeRows.length);
            this.paginationDataService.setPaginationData(paginationData);
            return traineesFetched({ trainees, traineeRows });
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
        );
      }));
  });

  createTrainee = createEffect(() => {
    return this.actions$.pipe(
      ofType(createTrainee),
      switchMap((createTraineeData) => {
        console.log(createTraineeData);
        return this.http.post<CreateUpdateDeleteTraineeResponse>(`${ this.apiPrefix }`, createTraineeData.data.traineeData).pipe(
          switchMap((createdTrainee) => {
            const updatedGradeData: CreateTraineeGrade = {
              ...createTraineeData.data.gradeData,
              traineeId: createdTrainee.id
            };
            return this.http.post<CreateOrUpdateGradeResponse>(`${ this.gradesApiPrefix }`, updatedGradeData).pipe(
              map(() => {
                const queryParams = this.route.snapshot.queryParams;
                this.toastr.success("Trainee created successfully");
                return getTrainees(queryParams as DataFiltersQueryParams);
              }),
              catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
            );
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
        );
      })
    );
  });

  editTrainee = createEffect(() => {
    return this.actions$.pipe(
      ofType(editTrainee),
      switchMap((editTraineeData) => {
        return this.http.put<CreateUpdateDeleteTraineeResponse>(`${ this.apiPrefix }/${ editTraineeData.data.traineeData.id }`, editTraineeData.data.traineeData).pipe(
          switchMap(() => {
            return this.http.put<CreateOrUpdateGradeResponse>(`${ this.gradesApiPrefix }/${ editTraineeData.data.gradeData.id }`, editTraineeData.data.gradeData).pipe(
              map(() => {
                const queryParams = this.route.snapshot.queryParams;
                this.toastr.success("Trainee updated successfully");
                return getTrainees(queryParams as DataFiltersQueryParams);
              }),
              catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
            );
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
        );
      })
    );
  });

  deleteTrainee = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteTrainee),
      switchMap((deleteTraineeData) => {
        return this.http.delete<CreateUpdateDeleteTraineeResponse>(`${ this.apiPrefix }/${ deleteTraineeData.id }`).pipe(
          map(() => {
            const queryParams = this.route.snapshot.queryParams;
            return getTrainees(queryParams as DataFiltersQueryParams);
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
        );
      }));
  });

  createTraineeGrade = createEffect(() => {
    return this.actions$.pipe(
      ofType(createTraineeGrade),
      switchMap((createTraineeGrade) => {
        console.log(createTraineeGrade);
        return this.http.post<CreateOrUpdateGradeResponse>(`${ this.gradesApiPrefix }`, createTraineeGrade.data).pipe(
          map(() => {
            const queryParams = this.route.snapshot.queryParams;
            console.log(queryParams);
            return getTrainees(queryParams as DataFiltersQueryParams);
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message))
        );
      }));
  });

  handleError(errorMessage: string) {
    this.toastr.error(errorMessage);
    return of(traineesError({ errorMessage }));
  }
}
