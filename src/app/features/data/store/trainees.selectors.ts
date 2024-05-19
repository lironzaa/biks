import { TraineesState } from "./trainees.reducer";

import { ChartSubjectsGradesAverages, ChartTraineesGradesAverages } from "../../analysis/analysis-charts-interface";
import { SubjectType } from "../types/subject-type";

export const selectTraineesState = (state: { trainees: TraineesState }) => state.trainees;

export const selectTraineesIds = (state: {
  trainees: TraineesState
}) => state.trainees.traineesOrigin.map(trainee => trainee.id);

export const selectTraineesRowsOrigin = (state: { trainees: TraineesState }) => state.trainees.traineesRowsOrigin;

export const selectTraineesOrigin = (state: { trainees: TraineesState }) => state.trainees.traineesOrigin;

export const selectSelectedTraineesRow = (state: { trainees: TraineesState }) => state.trainees.selectedTraineesRow;

export const selectGradesAveragesForSelectedSubjects = (state: { trainees: TraineesState }) => {
  const subjectsAverages: Partial<ChartSubjectsGradesAverages> = {};
  const counts: Partial<Record<SubjectType, number>> = {};

  for (const traineeRow of state.trainees.traineesRows) {
    if (state.trainees.selectedSubjects.includes(traineeRow.subject)) {
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
};

export const selectGradesAveragesForSelectedTrainees = (state: { trainees: TraineesState }) => {
  const averagesByTrainee: ChartTraineesGradesAverages[] = [];
  const traineeMap = new Map(state.trainees.trainees.map(trainee => [ trainee.id, trainee ]));

  state.trainees.selectedTraineesIds.forEach(traineeId => {
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
};

const getMonthYearFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${ year }-${ month < 10 ? "0" + month : month }`;
}

const formatNumber = (num: number): number => parseFloat(num.toFixed(2));
