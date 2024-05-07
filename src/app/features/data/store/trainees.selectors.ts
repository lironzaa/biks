import { TraineesState } from "./trainees.reducer";

export const selectTrainees = (state: { trainees: TraineesState }) => state.trainees;
export const selectTraineesIds = (state: {
  trainees: TraineesState
}) => state.trainees.trainees.map(trainee => trainee.id);

export const selectGradesAveragesForSelectedSubjects = (state: { trainees: TraineesState }) => {
  const subjectsAverages: { [subject: string]: number } = {};
  const counts: { [subject: string]: number } = {};

  state.trainees.traineesRows.filter(traineesRow => state.trainees.selectedSubjects.includes(traineesRow.subject))
    .forEach(traineeRow => {
      const grade = parseInt(traineeRow.grade, 10);
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
