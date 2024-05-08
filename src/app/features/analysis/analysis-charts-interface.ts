import { Trainee } from "../data/interfaces/trainee-interface";

export interface ChartTraineesGradesAverages {
  averages: {
    [monthYear: string]: number
  },
  trainee: Trainee
}

export interface ChartSubjectsGradesAverages {
  [subjectKey: string]: number
}
