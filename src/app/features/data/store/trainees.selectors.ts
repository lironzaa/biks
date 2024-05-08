import { TraineesState } from "./trainees.reducer";

export const selectTrainees = (state: { trainees: TraineesState }) => state.trainees;
export const selectTraineesIds = (state: {
  trainees: TraineesState
}) => state.trainees.trainees.map(trainee => trainee.id);

export const selectGradesAveragesForSelectedSubjects = (state: { trainees: TraineesState }) => {
  const subjectsAverages: { [subject: string]: number } = {};
  const counts: { [subject: string]: number } = {};

  console.log(state);

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
  console.log(subjectsAverages);
  return subjectsAverages;
};

export const selectGradesAveragesForSelectedTrainees = (state: { trainees: TraineesState }) => {
  const gradesAverages: { [trainee: string]: number } = {};
  const counts: { [subject: string]: number } = {};

  console.log(state);

  state.trainees.trainees.filter(trainees => state.trainees.selectedTraineesIds.includes(trainees.id))
    .forEach(trainee => {
      console.log(trainee);
      // const grade = parseInt(trainee.grade, 10);
      // if (trainee.subject in gradesAverages) {
      //   gradesAverages[trainee.subject] += grade;
      //   counts[trainee.subject]++;
      // } else {
      //   gradesAverages[trainee.subject] = grade;
      //   counts[trainee.subject] = 1;
      // }
    });

  for (const subject in gradesAverages) {
    gradesAverages[subject] /= counts[subject];
  }

  console.log(gradesAverages);
  return gradesAverages;
};
