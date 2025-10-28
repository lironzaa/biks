import { SubjectType } from "../types/subject-type";
import { GradeCreateData, TraineeCreateData } from "../types/trainee-type";

interface TraineeBase {
  id: string;
  address: string;
  city: string;
  country: string;
  dateJoined: string;
  email: string;
  name: string;
  zip: string;
}

export interface Trainee extends TraineeBase {
  average: number;
  exams: number;
  grades: TraineeGrade[];
}

export interface TraineeRow extends TraineeBase {
  grade: number;
  gradeDate: string;
  gradeId: string;
  subject: SubjectType;
}

export interface FormattedTrainees {
  traineeRows: TraineeRow[];
  trainees: Trainee[]
}

export interface TraineeGrade {
  id: string;
  date: string;
  grade: number;
  subject: SubjectType;
  traineeId: string;
}

export interface CreateTrainee {
  gradeData: GradeCreateData;
  traineeData: TraineeCreateData;
}

export interface EditTrainee {
  gradeData: TraineeGrade;
  traineeData: Omit<Trainee, "average" | "exams" | "grades">
}
