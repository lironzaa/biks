import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

import * as TraineesActions from './trainees.actions';
import {
  FormattedTrainees,
  Trainee,
  TraineeRow
} from '../interfaces/trainee-interface';
import { environment } from '../../../../environments/environment';
import { DataFiltersQueryParams } from '../interfaces/data-filters-query-params.interface';
import {
  CreateOrUpdateGradeResponse,
  CreateUpdateDeleteTraineeResponse
} from '../interfaces/trainee-api-responses.interface';
import { GradeCreateData } from '../types/trainee-type';
import { Utils } from '../../../shared/class/utils.class';

@Injectable()
export class TraineesEffects {
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  http = inject(HttpClient);
  actions$ = inject(Actions);

  baseUrl = environment.baseUrl;
  apiPrefix = this.baseUrl + 'trainees';
  gradesApiPrefix = this.baseUrl + 'grades';

  private calculateAverage(grades: { grade: number }[]): number {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, g) => sum + g.grade, 0);
    return Utils.roundToDecimal(total / grades.length, 2);
  }

  private enrichTrainee(trainee: Trainee): Trainee {
    return {
      ...trainee,
      average: this.calculateAverage(trainee.grades),
      exams: trainee.grades.length
    };
  }

  private traineeToRows(trainee: Trainee): TraineeRow[] {
    return trainee.grades.map(grade => ({
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
    }));
  }

  mapTraineeRows(trainees: Trainee[]): FormattedTrainees {
    const enrichedTrainees = trainees.map(t => this.enrichTrainee(t));
    const traineeRows = enrichedTrainees.flatMap(t => this.traineeToRows(t));

    return {
      trainees: enrichedTrainees,
      traineeRows
    };
  }

  getTrainees = createEffect(() => {
    return this.actions$.pipe(
      ofType(TraineesActions.getTrainees),
      switchMap(() => {
        return this.http.get<Trainee[]>(`${ this.apiPrefix }?_embed=grades`).pipe(
          map(trainees => {
            const formattedTrainees: FormattedTrainees = this.mapTraineeRows(trainees)
            return TraineesActions.traineesFetched({
              trainees: formattedTrainees.trainees,
              traineeRows: formattedTrainees.traineeRows
            });
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message, TraineesActions.getTraineesError)
          )
        )
      }));
  });

  createTrainee = createEffect(() => {
    return this.actions$.pipe(
      ofType(TraineesActions.createTrainee),
      switchMap((createTraineeData) => {
        return this.http.post<CreateUpdateDeleteTraineeResponse>(`${ this.apiPrefix }`, createTraineeData.data.traineeData).pipe(
          switchMap((createdTrainee) => {
            const updatedGradeData: GradeCreateData = {
              ...createTraineeData.data.gradeData,
              traineeId: createdTrainee.id
            };
            return this.http.post<CreateOrUpdateGradeResponse>(`${ this.gradesApiPrefix }`, updatedGradeData).pipe(
              map(() => {
                const queryParams = this.route.snapshot.queryParams;
                this.toastr.success('Trainee created successfully');
                return TraineesActions.getTrainees({ queryParams: queryParams as DataFiltersQueryParams });
              }),
              catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message, TraineesActions.createTraineeError))
            );
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message, TraineesActions.getTraineesError))
        );
      })
    );
  });

  editTrainee = createEffect(() => {
    return this.actions$.pipe(
      ofType(TraineesActions.editTrainee),
      switchMap((editTraineeData) => {
        return this.http.put<CreateUpdateDeleteTraineeResponse>(`${ this.apiPrefix }/${ editTraineeData.data.traineeData.id }`, editTraineeData.data.traineeData).pipe(
          switchMap(() => {
            return this.http.put<CreateOrUpdateGradeResponse>(`${ this.gradesApiPrefix }/${ editTraineeData.data.gradeData.id }`, editTraineeData.data.gradeData).pipe(
              map(() => {
                const queryParams = this.route.snapshot.queryParams;
                this.toastr.success('Trainee updated successfully');
                return TraineesActions.getTrainees({ queryParams: queryParams as DataFiltersQueryParams });
              }),
              catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message, TraineesActions.editTraineeError))
            );
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message, TraineesActions.getTraineesError))
        );
      })
    );
  });

  deleteTrainee = createEffect(() => {
    return this.actions$.pipe(
      ofType(TraineesActions.deleteTrainee),
      switchMap((deleteTraineeData) => {
        return this.http.delete<CreateUpdateDeleteTraineeResponse>(`${ this.apiPrefix }/${ deleteTraineeData.id }`).pipe(
          mergeMap(() => {
            const queryParams = this.route.snapshot.queryParams;
            return [
              TraineesActions.setSelectedTraineeRow({ traineeRow: null }),
              TraineesActions.getTrainees({ queryParams: queryParams as DataFiltersQueryParams })
            ];
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message, TraineesActions.deleteTraineeError))
        );
      })
    );
  });

  createTraineeGrade = createEffect(() => {
    return this.actions$.pipe(
      ofType(TraineesActions.createTraineeGrade),
      switchMap((createTraineeGrade) => {
        return this.http.post<CreateOrUpdateGradeResponse>(`${ this.gradesApiPrefix }`, createTraineeGrade.data).pipe(
          map(() => {
            const queryParams = this.route.snapshot.queryParams;
            return TraineesActions.getTrainees({ queryParams: queryParams as DataFiltersQueryParams });
          }),
          catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes.message, TraineesActions.createTraineeGradeError))
        );
      }));
  });

  handleError(errorMessage: string, actionCreator: (props: { error: string }) => any) {
    console.log(errorMessage);
    this.toastr.error(errorMessage);
    return of(actionCreator({ error: errorMessage }));
  }
}
