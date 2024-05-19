import { createFeature, createReducer, createSelector, on } from "@ngrx/store";

import { Trainee, TraineeRow } from "../interfaces/trainee-interface";
import {
  createTrainee,
  createTraineeGrade,
  editTrainee,
  filterTrainees,
  filterTraineesRows,
  getTrainees,
  setSelectedSubjects,
  setSelectedTraineeRow,
  setSelectedTraineesIds,
  traineesError,
  traineesFetched,
} from "./trainees.actions";
import { SubjectType } from "../types/subject-type";
import { ChartSubjectsGradesAverages, ChartTraineesGradesAverages } from "../../analysis/analysis-charts-interface";

export interface TraineesState {
  trainees: Trainee[];
  traineesOrigin: Trainee[];
  traineesRows: TraineeRow[];
  traineesRowsOrigin: TraineeRow[];
  selectedTraineesRow: TraineeRow | null;
  isLoading: boolean;
  error: string | null;
  selectedSubjects: SubjectType[];
  selectedTraineesIds: string[];
}

const initialState: TraineesState = {
  trainees: [],
  traineesOrigin: [],
  traineesRows: [],
  traineesRowsOrigin: [],
  selectedTraineesRow: null,
  isLoading: false,
  error: null,
  selectedSubjects: [],
  selectedTraineesIds: [],
};

export const traineesFeature = createFeature({
  name: "trainees",
  reducer: createReducer(
    initialState,
    on(getTrainees, (state): TraineesState => ({
      ...state,
      trainees: [],
      traineesRowsOrigin: [],
      error: null,
      isLoading: true
    })),
    on(traineesFetched, (state, { trainees, traineeRows }): TraineesState => ({
      ...state,
      trainees: trainees,
      traineesOrigin: trainees,
      traineesRows: traineeRows,
      traineesRowsOrigin: traineeRows,
      error: null,
      isLoading: false
    })),
    on(createTrainee, (state): TraineesState => ({
      ...state,
      error: null,
      isLoading: true
    })),
    on(editTrainee, (state, { selectedTraineeRow }): TraineesState => ({
      ...state,
      selectedTraineesRow: selectedTraineeRow,
      error: null,
      isLoading: true
    })),
    on(setSelectedTraineeRow, (state, { traineeRow }): TraineesState => ({
      ...state,
      selectedTraineesRow: traineeRow,
      error: null,
      isLoading: false
    })),
    on(traineesError, (state, { errorMessage }): TraineesState => ({
      ...state,
      error: errorMessage,
      isLoading: false
    })),
    on(createTraineeGrade, (state): TraineesState => ({
      ...state,
      error: null,
      isLoading: true
    })),
    on(filterTraineesRows, (state, { traineesRows }): TraineesState => ({
      ...state,
      traineesRows: traineesRows,
      error: null,
      isLoading: false
    })),
    on(filterTrainees, (state, { trainees }): TraineesState => ({
      ...state,
      trainees: trainees,
      error: null,
      isLoading: false
    })),
    on(setSelectedSubjects, (state, { selectedSubjects }): TraineesState => ({
      ...state,
      selectedSubjects: selectedSubjects,
      error: null,
      isLoading: false,
    })),
    on(setSelectedTraineesIds, (state, { traineesIds }): TraineesState => ({
      ...state,
      selectedTraineesIds: traineesIds,
      error: null,
      isLoading: false,
    })),
  ),
  extraSelectors: ({
                     selectTraineesOrigin,
                     selectTraineesRows,
                     selectSelectedSubjects,
                     selectTrainees,
                     selectSelectedTraineesIds
                   }) => ({
    selectTraineesIds: createSelector(
      selectTraineesOrigin,
      traineesOrigin => traineesOrigin.map(trainee => trainee.id)
    ),
    selectGradesAveragesForSelectedSubjects: createSelector(
      selectTraineesRows, selectSelectedSubjects,
      (traineesRows, selectedSubjects) => {
        const subjectsAverages: Partial<ChartSubjectsGradesAverages> = {};
        const counts: Partial<Record<SubjectType, number>> = {};

        for (const traineeRow of traineesRows) {
          if (selectedSubjects.includes(traineeRow.subject)) {
            const subject = traineeRow.subject;
            const grade = traineeRow.grade;

            if (subjectsAverages[subject] !== undefined) {
              subjectsAverages[subject]! += grade;
              counts[subject]! += 1;
            } else {
              subjectsAverages[subject] = grade;
              counts[subject] = 1;
            }
          }
        }

        for (const subject in subjectsAverages) {
          const typedSubject = subject as SubjectType;
          const average = subjectsAverages[typedSubject]! / counts[typedSubject]!;

          subjectsAverages[typedSubject] = formatNumber(average);
        }

        return subjectsAverages;
      }
    ),
    selectGradesAveragesForSelectedTrainees: createSelector(
      selectTrainees, selectSelectedTraineesIds,
      (trainees, selectedTraineesIds) => {
        const averagesByTrainee: ChartTraineesGradesAverages[] = [];
        const traineeMap = new Map(trainees.map(trainee => [ trainee.id, trainee ]));

        selectedTraineesIds.forEach(traineeId => {
          const trainee = traineeMap.get(traineeId);
          if (trainee) {
            const gradesByMonthYear: { [monthYear: string]: number } = {};
            const counts: { [monthYear: string]: number } = {};

            trainee.grades.forEach(traineeGrade => {
              const monthYear = getMonthYearFromDate(traineeGrade.date);
              if (!gradesByMonthYear[monthYear]) {
                gradesByMonthYear[monthYear] = 0;
                counts[monthYear] = 0;
              }
              gradesByMonthYear[monthYear] += traineeGrade.grade;
              counts[monthYear]++;
            });

            const averagesByMonthYear: { [monthYear: string]: number } = {};
            Object.keys(gradesByMonthYear).sort().forEach(monthYear => {
              averagesByMonthYear[monthYear] = formatNumber(gradesByMonthYear[monthYear] / counts[monthYear]);
            });

            averagesByTrainee.push({ trainee: { id: trainee.id, name: trainee.name }, averages: averagesByMonthYear });
          }
        });

        return averagesByTrainee;
      }
    )
  })
})

const getMonthYearFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${ year }-${ month < 10 ? "0" + month : month }`;
}

const formatNumber = (num: number): number => parseFloat(num.toFixed(2));
