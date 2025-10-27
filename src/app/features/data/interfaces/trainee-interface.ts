import { SubjectType } from "../types/subject-type";
import { GradeCreateData, TraineeCreateData } from "../types/trainee-type";

interface TraineeBase {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface Trainee extends TraineeBase {
  average: number;
  exams: number;
  dynamicTrClass?: string;
  grades: TraineeGrade[];
}

export interface TraineeRow extends TraineeBase {
  grade: number;
  gradeDate: string;
  subject: SubjectType;
  gradeId: string;
}

export interface FormattedTrainees {
  traineeRows: TraineeRow[];
  trainees: Trainee[]
}

export interface TraineeGrade {
  id: string;
  grade: number;
  subject: SubjectType;
  date: string;
  traineeId: string;
}

export interface CreateTrainee {
  traineeData: TraineeCreateData;
  gradeData: GradeCreateData;
}

export interface EditTrainee {
  traineeData: Omit<Trainee, "average" | "exams" | "dynamicTrClass" | "grades">
  gradeData: TraineeGrade;
}
