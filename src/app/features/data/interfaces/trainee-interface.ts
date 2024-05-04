import { SubjectType } from "../types/subject-type";

export interface Trainee {
  id: number;
  name: string;
  grades: TraineeGrade[];
  email: string;
  dateJoined: string;
  address: string;
  city: string;
  country: string;
  zip: number;
}

export interface TraineeGrade {
  grade: number;
  subject: SubjectType;
}
