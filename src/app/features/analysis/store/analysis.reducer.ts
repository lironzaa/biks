import { SubjectType } from "../../data/types/subject-type";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";

import { setSelectedSubjects, setSelectedTraineesIds } from "./analysis.actions";
import {
  ChartSubjectsGradesAverages,
  ChartTraineesGradesAverages
} from "../components/interfaces/analysis-charts-interface";
import { Utils } from "../../../shared/class/utils.class";
import { traineesFeature } from "../../data/store/trainees.reducer";

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
  name: "analysis",
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
      traineesFeature.selectTraineesRows, selectSelectedSubjects,
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

          subjectsAverages[typedSubject] = Utils.roundToDecimal(average, 2);
        }

        return subjectsAverages;
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
    )
  })
})
