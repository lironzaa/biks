import { Trainee } from '../../data/interfaces/trainee-interface';
import { SubjectType } from '../../data/types/subject-type';

export interface ChartTraineesGradesAverages {
  averages: {
    [monthYear: string]: number
  },
  trainee: Pick<Trainee, 'id' | 'name'>
}

export type ChartSubjectsGradesAverages = {
  [key in SubjectType]: number;
};

export interface ChartDataInterface {
  [key: string]: number;
}
