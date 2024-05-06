import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";

import { createTrainee, getTrainees, traineesError, traineesFetched } from "./trainees.actions";
import { CreateTraineeGrade, Trainee, TraineeRow } from "../interfaces/trainee-interface";
import { PaginationDataService } from "../../../shared/services/pagination-data.service";
import { environment } from "../../../../environments/environment";
import { DataFiltersQueryParams } from "../interfaces/data-filters-query-params.interface";
import { CreateGradeResponse, CreateTraineeResponse } from "../interfaces/trainee-api-responses.interface";

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
            console.log(trainees);
            const traineeRows: TraineeRow[] = [];
            this.mapTraineeRows(trainees, traineeRows);
            console.log(traineeRows);
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
        return this.http.post<CreateTraineeResponse>(`${ this.apiPrefix }`, createTraineeData.data.traineeData).pipe(
          switchMap((createdTrainee) => {
            const updatedGradeData: CreateTraineeGrade = {
              ...createTraineeData.data.gradeData,
              traineeId: createdTrainee.id
            };
            return this.http.post<CreateGradeResponse>(`${ this.gradesApiPrefix }`, updatedGradeData).pipe(
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

  handleError(errorMessage: string) {
    this.toastr.error(errorMessage);
    return of(traineesError({ errorMessage }));
  }
}
