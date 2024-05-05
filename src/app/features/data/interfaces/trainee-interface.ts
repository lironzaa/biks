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

export interface CreateTrainee {
  name: string;
  grade: number;
  email: string;
  dateJoined: string;
  address: string;
  city: string;
  country: string;
  zip: number;
  subject: SubjectType;
}
