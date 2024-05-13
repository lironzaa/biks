import { TraineesState } from "./trainees.reducer";

import { ChartSubjectsGradesAverages, ChartTraineesGradesAverages } from "../../analysis/analysis-charts-interface";

export const selectTraineesState = (state: { trainees: TraineesState }) => state.trainees;

export const selectTraineesIds = (state: {
  trainees: TraineesState
}) => state.trainees.traineesOrigin.map(trainee => trainee.id);

export const selectTraineesRowsOrigin = (state: { trainees: TraineesState }) => state.trainees.traineesRowsOrigin;

export const selectTraineesOrigin = (state: { trainees: TraineesState }) => state.trainees.traineesOrigin;

export const selectSelectedTraineesRow = (state: { trainees: TraineesState }) => state.trainees.selectedTraineesRow;

export const selectGradesAveragesForSelectedSubjects = (state: { trainees: TraineesState }) => {
  const subjectsAverages: ChartSubjectsGradesAverages = {};
  const counts: { [subject: string]: number } = {};

  state.trainees.traineesRows.filter(traineesRow => state.trainees.selectedSubjects.includes(traineesRow.subject))
    .forEach(traineeRow => {
      const grade = traineeRow.grade;
      if (traineeRow.subject in subjectsAverages) {
        subjectsAverages[traineeRow.subject] += grade;
        counts[traineeRow.subject]++;
      } else {
        subjectsAverages[traineeRow.subject] = grade;
        counts[traineeRow.subject] = 1;
      }
    });

  for (const subject in subjectsAverages) {
    subjectsAverages[subject] /= counts[subject];
  }

  return subjectsAverages;
};

export const selectGradesAveragesForSelectedTrainees = (state: { trainees: TraineesState }) => {
  const averagesByTrainee: ChartTraineesGradesAverages[] = [];

  state.trainees.selectedTraineesIds.forEach(traineeId => {
    const gradesByMonthYear: { [monthYear: string]: number[] } = {};
    const counts: { [monthYear: string]: number } = {};

    const trainee = state.trainees.trainees.find(trainee => trainee.id === traineeId);
    if (trainee) {
      trainee.grades.forEach(traineeGrade => {
        const monthYear = getMonthYearFromDate(traineeGrade.date);
        if (!(monthYear in gradesByMonthYear)) {
          gradesByMonthYear[monthYear] = [];
          counts[monthYear] = 0;
        }
        gradesByMonthYear[monthYear].push(traineeGrade.grade);
        counts[monthYear]++;
      });

      const averagesByMonthYear: { [monthYear: string]: number } = {};
      for (const monthYear in gradesByMonthYear) {
        const totalGrade = gradesByMonthYear[monthYear].reduce((acc, grade) => acc + grade, 0);
        averagesByMonthYear[monthYear] = totalGrade / counts[monthYear];
      }

      averagesByTrainee.push({ trainee, averages: averagesByMonthYear });
    }
  });

  return averagesByTrainee;
}

function getMonthYearFromDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${ year }-${ month < 10 ? "0" + month : month }`;
}
