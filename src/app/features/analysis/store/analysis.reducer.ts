import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { SubjectType } from '../../data/types/subject-type';
import { setSelectedSubjects, setSelectedTraineesIds } from './analysis.actions';
import { Utils } from '../../../shared/class/utils.class';
import { traineesFeature } from '../../data/store/trainees.reducer';
import { ChartSubjectsGradesAverages, ChartTraineesGradesAverages } from '../interfaces/analysis-charts-interface';

export interface AnalysisState {
  selectedSubjects: SubjectType[];
  selectedTraineesIds: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  selectedSubjects: [],
  selectedTraineesIds: [],
  isLoading: false,
  error: null,
}

export const analysisFeature = createFeature({
  name: 'analysis',
  reducer: createReducer(
    initialState,
    on(setSelectedSubjects, (state, { selectedSubjects }): AnalysisState => ({
      ...state,
      selectedSubjects: selectedSubjects,
      error: null,
      isLoading: false,
    })),
    on(setSelectedTraineesIds, (state, { traineesIds }): AnalysisState => ({
      ...state,
      selectedTraineesIds: traineesIds,
      error: null,
      isLoading: false,
    })),
  ),
  extraSelectors: ({
                     selectSelectedSubjects,
                     selectSelectedTraineesIds
                   }) => ({
    selectGradesAveragesForSelectedSubjects: createSelector(
      traineesFeature.selectTraineesRows,
      selectSelectedSubjects,
      (traineesRows, selectedSubjects) => {
        const subjectsData = new Map<SubjectType, { total: number; count: number }>();

        for (const row of traineesRows) {
          if (selectedSubjects.includes(row.subject)) {
            const existing = subjectsData.get(row.subject);
            if (existing) {
              existing.total += row.grade;
              existing.count += 1;
            } else {
              subjectsData.set(row.subject, { total: row.grade, count: 1 });
            }
          }
        }

        const result: Partial<ChartSubjectsGradesAverages> = {};
        for (const [subject, data] of subjectsData.entries()) {
          result[subject] = Utils.roundToDecimal(data.total / data.count, 2);
        }

        return result;
      }
    ),
    selectGradesAveragesForSelectedTrainees: createSelector(
      traineesFeature.selectTrainees, selectSelectedTraineesIds,
      (trainees, selectedTraineesIds) => {
        const averagesByTrainee: ChartTraineesGradesAverages[] = [];
        const traineeMap = new Map(trainees.map(trainee => [ trainee.id, trainee ]));

        selectedTraineesIds.forEach(traineeId => {
          const trainee = traineeMap.get(traineeId);
          if (trainee) {
            const gradesByMonthYear: { [monthYear: string]: number } = {};
            const counts: { [monthYear: string]: number } = {};

            trainee.grades.forEach(traineeGrade => {
              const monthYear = Utils.getMonthYearFromDate(traineeGrade.date);
              if (!gradesByMonthYear[monthYear]) {
                gradesByMonthYear[monthYear] = 0;
                counts[monthYear] = 0;
              }
              gradesByMonthYear[monthYear] += traineeGrade.grade;
              counts[monthYear]++;
            });

            const averagesByMonthYear: { [monthYear: string]: number } = {};
            Object.keys(gradesByMonthYear).sort().forEach(monthYear => {
              averagesByMonthYear[monthYear] = Utils.roundToDecimal(gradesByMonthYear[monthYear] / counts[monthYear], 2);
            });

            averagesByTrainee.push({ trainee: { id: trainee.id, name: trainee.name }, averages: averagesByMonthYear });
          }
        });

        return averagesByTrainee;
      }
    ),
    selectOverallAveragesForSelectedTrainees: createSelector(
      traineesFeature.selectTrainees,
      selectSelectedTraineesIds,
      (trainees, selectedTraineesIds) => {
        const result: { [key: string]: number } = {};
        const traineeMap = new Map(trainees.map(trainee => [ trainee.id, trainee ]));

        selectedTraineesIds.forEach(traineeId => {
          const trainee = traineeMap.get(traineeId);
          if (trainee && trainee.average !== undefined) {
            result[trainee.name] = trainee.average;
          }
        });

        return result;
      }
    )
  })
})
